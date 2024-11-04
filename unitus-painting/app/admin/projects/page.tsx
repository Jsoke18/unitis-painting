"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, Table, Upload, Modal, Popconfirm, Image, Collapse } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import axios from 'axios';

const { TextArea } = Input;
const { Panel } = Collapse;

interface ProjectSpecs {
  area?: string;
  duration?: string;
  team?: string;
}

interface ProjectImage {
  url: string;
  alt?: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  images: ProjectImage[];
  category?: string;
  location?: string;
  completionDate?: string;
  specs?: ProjectSpecs;
  createdAt: string;
  updatedAt?: string;
}

interface FormValues extends Omit<Project, 'id' | 'images' | 'createdAt' | 'updatedAt'> {
  specs?: ProjectSpecs;
}

const categories = [
  "Hospitality",
  "Strata and Condo",
  "Residential",
  "Commercial",
];

const ProjectAdmin: React.FC = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [editFileList, setEditFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setTableLoading(true);
    try {
      const response = await fetch('/data/projects.json');
      const data = await response.json();
      const projectsArray = data.projects || [];
      setProjects(Array.isArray(projectsArray) ? projectsArray : []);
    } catch (error) {
      console.error('Failed to load projects:', error);
      message.error('Failed to load projects');
      setProjects([]);
    } finally {
      setTableLoading(false);
    }
  };

  const handleUploadChange = (info: any, isEditing: boolean) => {
    const { fileList } = info;
    if (isEditing) {
      setEditFileList(fileList);
    } else {
      setFileList(fileList);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/upload',
    multiple: true,
    listType: "picture-card",
    onChange: (info) => handleUploadChange(info, !!editingProject),
  };

  const createProject = async (values: FormValues) => {
    setLoading(true);
    try {
      const images = fileList.map(file => ({
        url: file.response?.url || file.url,
        alt: file.name
      })).filter(img => img.url);

      const newProject: Project = {
        id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
        title: values.title,
        description: values.description,
        category: values.category,
        location: values.location,
        completionDate: values.completionDate,
        specs: {
          area: values.specs?.area,
          duration: values.specs?.duration,
          team: values.specs?.team,
        },
        images: images,
        createdAt: new Date().toISOString(),
      };

      const updatedProjects = [...projects, newProject];
      await axios.post('/api/projects', { projects: updatedProjects });
      
      setProjects(updatedProjects);
      message.success('Project added successfully');
      setAddModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error('Failed to add project:', error);
      message.error('Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (values: FormValues) => {
    if (!editingProject) return;

    setLoading(true);
    try {
      const images = editFileList.map(file => ({
        url: file.response?.url || file.url,
        alt: file.name
      })).filter(img => img.url);

      const updatedProject: Project = {
        ...editingProject,
        title: values.title,
        description: values.description,
        category: values.category,
        location: values.location,
        completionDate: values.completionDate,
        specs: {
          area: values.specs?.area,
          duration: values.specs?.duration,
          team: values.specs?.team,
        },
        images: images,
        updatedAt: new Date().toISOString(),
      };

      await axios.put('/api/projects', { project: updatedProject });
      message.success('Project updated successfully');
      setEditModalVisible(false);
      await fetchProjects();
      setEditFileList([]);
    } catch (error) {
      console.error('Failed to update project:', error);
      message.error('Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '15%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '25%',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '10%',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: '10%',
    },
    {
      title: 'Images',
      key: 'images',
      width: '20%',
      render: (_: any, record: Project) => (
        <div className="flex gap-2 overflow-x-auto">
          {record.images?.map((image, index) => (
            <Image
              key={index}
              src={image.url}
              alt={image.alt || `Project image ${index + 1}`}
              width={50}
              height={50}
              className="object-cover rounded"
            />
          ))}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_: any, record: Project) => (
        <div className="space-x-2">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete project"
            description="Are you sure you want to delete this project?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleEdit = (record: Project) => {
    setEditingProject(record);
    editForm.setFieldsValue({
      ...record,
      specs: {
        area: record.specs?.area,
        duration: record.specs?.duration,
        team: record.specs?.team,
      }
    });
    setEditFileList(record.images?.map((img, index) => ({
      uid: `-${index}`,
      name: img.alt || `Image ${index + 1}`,
      status: 'done',
      url: img.url,
    })) || []);
    setEditModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/projects?id=${id}`);
      message.success('Project deleted successfully');
      await fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      message.error('Failed to delete project');
    }
  };

  const ProjectForm = ({ form, onFinish, submitText, loading, fileList }: any) => (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      {/* Required Fields */}
      <Form.Item
        name="title"
        label="Project Title"
        rules={[{ required: true, message: 'Please enter project title' }]}
      >
        <Input placeholder="Enter project title" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter description' }]}
      >
        <TextArea rows={4} placeholder="Enter project description" />
      </Form.Item>

      {/* Optional Fields in Collapse Panel */}
      <Collapse className="mb-4">
        <Panel header="Additional Information (Optional)" key="1">
          <Form.Item
            name="category"
            label="Category"
          >
            <Select placeholder="Select category" allowClear>
              {categories.map(category => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
          >
            <Input placeholder="Enter project location" />
          </Form.Item>

          <Form.Item
            name="completionDate"
            label="Completion Date"
          >
            <Input type="date" />
          </Form.Item>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-4">Project Specifications</h3>
            <Form.Item name={["specs", "area"]} label="Area">
              <Input placeholder="e.g., 10,000 sq ft" />
            </Form.Item>

            <Form.Item name={["specs", "duration"]} label="Duration">
              <Input placeholder="e.g., 3 months" />
            </Form.Item>

            <Form.Item name={["specs", "team"]} label="Team Size">
              <Input placeholder="e.g., 12 professionals" />
            </Form.Item>
          </div>
        </Panel>
      </Collapse>

      <Form.Item
        label="Project Images"
      >
        <Upload {...uploadProps} fileList={fileList}>
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Project Management</h1>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setAddModalVisible(true)}
            size="large"
          >
            Add Project
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Table
            columns={columns}
            dataSource={projects}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={tableLoading}
          />
        </div>

        <Modal
          title="Add New Project"
          open={addModalVisible}
          onCancel={() => {
            setAddModalVisible(false);
            setFileList([]);
            form.resetFields();
          }}
          footer={null}
          width={800}
        >
          <ProjectForm
            form={form}
            onFinish={createProject}
            submitText="Add Project"
            loading={loading}
            fileList={fileList}
          />
        </Modal>

        <Modal
          title="Edit Project"
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            setEditingProject(null);
            setEditFileList([]);
            editForm.resetFields();
          }}
          footer={null}
          width={800}
        >
          <ProjectForm
            form={editForm}
            onFinish={updateProject}
            submitText="Update Project"
            loading={loading}
            fileList={editFileList}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ProjectAdmin;