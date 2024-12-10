"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, Table, Upload, Modal, Popconfirm, Image, Divider } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import axios from 'axios';

const { TextArea } = Input;

interface ProjectSpecs {
  area?: string;
  duration?: string;
  team?: string;
}

interface Project {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  location?: string;
  completionDate?: string;
  specs?: ProjectSpecs;
  createdAt: string;
  updatedAt?: string;
}

interface FormValues extends Omit<Project, 'id' | 'imageUrl' | 'createdAt' | 'updatedAt'> {
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
  const [imageUrl, setImageUrl] = useState<string>('');
  const [editImageUrl, setEditImageUrl] = useState<string>('');

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

  const handleUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url;
    } catch (error) {
      throw new Error('Upload failed');
    }
  };

  const uploadProps: UploadProps = {
    beforeUpload: async (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }

      try {
        const url = await handleUpload(file);
        if (editingProject) {
          setEditImageUrl(url);
        } else {
          setImageUrl(url);
        }
        message.success('Upload successful!');
      } catch (error) {
        message.error('Upload failed.'); 
      }
      return false;
    },
    maxCount: 1,
    showUploadList: true,
    listType: "picture-card",
  };

  const createProject = async (values: FormValues) => {
    setLoading(true);
    try {
      if (!imageUrl) {
        message.error('Please upload an image');
        return;
      }

      const newProject: Project = {
        id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
        title: values.title,
        description: values.description || '',
        category: values.category,
        location: values.location,
        completionDate: values.completionDate,
        imageUrl: imageUrl,
        createdAt: new Date().toISOString(),
      };

      const updatedProjects = [...projects, newProject];
      await axios.post('/api/projects', { projects: updatedProjects });
      
      setProjects(updatedProjects);
      message.success('Project added successfully');
      setAddModalVisible(false);
      form.resetFields();
      setImageUrl('');
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
      const updatedProject: Project = {
        ...editingProject,
        title: values.title,
        description: values.description || '',
        category: values.category,
        location: values.location,
        completionDate: values.completionDate,
        imageUrl: editImageUrl || editingProject.imageUrl,
        updatedAt: new Date().toISOString(),
      };

      await axios.put('/api/projects', { project: updatedProject });
      message.success('Project updated successfully');
      setEditModalVisible(false);
      await fetchProjects();
      setEditImageUrl('');
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
      render: (text: string) => text || '',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '10%',
      render: (text: string) => text || '',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: '10%',
      render: (text: string) => text || '',
    },
    {
      title: 'Image',
      key: 'image',
      width: '20%',
      render: (_: any, record: Project) => (
        record.imageUrl && (
          <Image
            src={record.imageUrl}
            alt={record.title}
            width={100}
            height={100}
            className="object-cover rounded"
          />
        )
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
    });
    setEditImageUrl(record.imageUrl || '');
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

  const ProjectForm = ({ form, onFinish, submitText, loading, currentImageUrl }: any) => (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="overflow-y-auto max-h-[calc(100vh-200px)]"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
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
          >
            <TextArea rows={4} placeholder="Enter project description" />
          </Form.Item>

          <Form.Item
            label="Project Image"
            required
          >
            <Upload {...uploadProps}>
              {!currentImageUrl && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            {currentImageUrl && (
              <div className="mt-2">
                <Image
                  src={currentImageUrl}
                  alt="Current project image"
                  width={200}
                  height={200}
                  className="object-cover rounded"
                />
              </div>
            )}
          </Form.Item>
        </div>

        <Divider />

        <div>
          <h3 className="text-lg font-medium mb-4">Additional Information</h3>
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
        </div>

        <Form.Item className="mb-0 sticky bottom-0 bg-white pt-4 pb-0">
          <Button type="primary" htmlType="submit" loading={loading}>
            {submitText}
          </Button>
        </Form.Item>
      </div>
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
            setImageUrl('');
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
            currentImageUrl={imageUrl}
          />
        </Modal>

        <Modal
          title="Edit Project"
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            setEditingProject(null);
            setEditImageUrl('');
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
            currentImageUrl={editImageUrl || editingProject?.imageUrl}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ProjectAdmin;