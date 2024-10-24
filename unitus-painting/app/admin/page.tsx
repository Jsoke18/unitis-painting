"use client";

import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Tag, message, List, Tooltip, Popconfirm, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagsOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import { useBlogStore, BlogPost } from '@/lib/blogService';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// Image Upload Component
const ImageUpload: React.FC<{ value?: string; onChange?: (url: string) => void }> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }
    return true;
  };

  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      onChange?.(info.file.response.url);
      message.success('Image uploaded successfully');
    }
    if (info.file.status === 'error') {
      setLoading(false);
      message.error('Image upload failed');
    }
  };

  return (
    <Upload
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="/api/upload"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {value ? (
        <img src={value} alt="featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )}
    </Upload>
  );
};

const BlogCMS = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [content, setContent] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [selectedRows, setSelectedRows] = useState<BlogPost[]>([]);
  
  const { posts, categories, addPost, updatePost, deletePost, addCategory, deleteCategory } = useBlogStore();

  // Table column definitions
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      sorter: (a: BlogPost, b: BlogPost) => a.title.localeCompare(b.title),
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="truncate block max-w-xs">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '15%',
      filters: categories.map(cat => ({ text: cat, value: cat })),
      onFilter: (value: string | number | boolean, record: BlogPost) => record.category === value,
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      sorter: (a: BlogPost, b: BlogPost) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: '10%',
      render: (image: string) => (
        <img 
          src={image} 
          alt="thumbnail" 
          className="w-16 h-16 object-cover rounded"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.jpg'; // Add a placeholder image
          }}
        />
      ),
    },
    {
      title: 'Read Time',
      dataIndex: 'readTime',
      key: 'readTime',
      width: '10%',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: '20%',
      render: (tags: string[]) => (
        <div className="flex flex-wrap gap-1">
          {tags.map(tag => (
            <Tag key={tag} color="green">{tag}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_: any, record: BlogPost) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Edit post"
          />
          <Popconfirm
            title="Delete post?"
            description="Are you sure you want to delete this post?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
              title="Delete post"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Post management handlers
  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setContent(post.content);
    form.setFieldsValue({
      ...post,
      tags: post.tags.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (postId: number) => {
    try {
      deletePost(postId);
      message.success('Post deleted successfully');
    } catch (error) {
      message.error('Failed to delete post');
    }
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: `Delete ${selectedRows.length} posts?`,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        selectedRows.forEach(post => deletePost(post.id));
        setSelectedRows([]);
        message.success(`${selectedRows.length} posts deleted successfully`);
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const postData = {
        ...values,
        content,
        tags: values.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
        author: 'John Smith', // In a real app, this would come from auth context
      };

      if (editingPost) {
        updatePost({ ...postData, id: editingPost.id, date: editingPost.date });
        message.success('Post updated successfully');
      } else {
        addPost(postData);
        message.success('Post created successfully');
      }
      
      handleModalClose();
    } catch (error) {
      console.error('Form submission error:', error);
      message.error('Please check your input and try again');
    }
  };

  const handleModalClose = () => {
    form.resetFields();
    setContent('');
    setIsModalOpen(false);
    setEditingPost(null);
  };

  // Category management handlers
  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();
    if (!trimmedCategory) {
      message.error('Category name cannot be empty');
      return;
    }
    
    if (categories.includes(trimmedCategory)) {
      message.error('Category already exists');
      return;
    }

    if (trimmedCategory.length > 30) {
      message.error('Category name is too long');
      return;
    }

    addCategory(trimmedCategory);
    setNewCategory('');
    message.success('Category added successfully');
  };

  const handleDeleteCategory = (category: string) => {
    const postsInCategory = posts.filter(post => post.category === category).length;
    Modal.confirm({
      title: 'Delete Category',
      content: `This will affect ${postsInCategory} posts. They will be marked as "Uncategorized". Continue?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteCategory(category);
        message.success('Category deleted successfully');
      },
    });
  };

  // Table selection configuration
  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: BlogPost[]) => {
      setSelectedRows(selectedRows);
    },
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Blog Management</h1>
          <p className="text-gray-600">
            Manage your blog posts and categories
          </p>
        </div>
        <Space>
          <Button
            icon={<TagsOutlined />}
            onClick={() => setIsCategoryModalOpen(true)}
          >
            Manage Categories
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            New Post
          </Button>
        </Space>
      </div>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
          <span>{selectedRows.length} posts selected</span>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={handleBulkDelete}
          >
            Delete Selected
          </Button>
        </div>
      )}

      {/* Posts Table */}
      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        rowSelection={rowSelection}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} posts`
        }}
      />

      {/* Post Edit/Create Modal */}
      <Modal
        title={editingPost ? 'Edit Post' : 'Create New Post'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalClose}
        width={800}
        confirmLoading={false}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ readTime: '5 min read' }}
        >
          <Form.Item
            name="image"
            label="Featured Image"
            rules={[{ required: true, message: 'Please upload an image!' }]}
            tooltip="Upload a featured image for your blog post"
          >
            <ImageUpload />
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: 'Please input the title!' },
              { max: 100, message: 'Title is too long!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select>
              {categories.map(category => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Excerpt"
            rules={[
              { required: true, message: 'Please input the excerpt!' },
              { max: 300, message: 'Excerpt is too long!' }
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Content"
            required
            tooltip="Rich text editor for the main content of your post"
          >
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent}
              style={{ height: '200px', marginBottom: '50px' }}
            />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
            tooltip="Comma-separated list of tags"
            rules={[
              { required: true, message: 'Please input at least one tag!' },
              { 
                validator: (_, value) => {
                  const tags = value.split(',').map((tag: string) => tag.trim());
                  if (tags.some((tag: string) => tag.length > 20)) {
                    return Promise.reject('Tags must be less than 20 characters');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input.TextArea 
              rows={2}
              placeholder="Enter tags separated by commas (e.g., painting, renovation, tips)"
            />
          </Form.Item>

          <Form.Item
            name="readTime"
            label="Read Time"
            rules={[{ required: true, message: 'Please input the read time!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

    {/* Category Management Modal */}
    <Modal
        title="Manage Categories"
        open={isCategoryModalOpen}
        onCancel={() => setIsCategoryModalOpen(false)}
        footer={null}
      >
        <div className="mb-4">
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 100px)' }}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              maxLength={30}
              onPressEnter={handleAddCategory}
            />
            <Button 
              type="primary" 
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
            >
              Add
            </Button>
          </Input.Group>
        </div>
        
        <List
          dataSource={categories}
          renderItem={category => (
            <List.Item
              actions={[
                <Popconfirm
                  key="delete"
                  title="Delete category?"
                  description="This will affect all posts in this category"
                  onConfirm={() => handleDeleteCategory(category)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              ]}
            >
              <div className="flex items-center gap-2">
                <Tag color="blue">{category}</Tag>
                <span className="text-gray-500">
                  ({posts.filter(post => post.category === category).length} posts)
                </span>
              </div>
            </List.Item>
          )}
        />
      </Modal>

      {/* Style for Image Upload */}
      <style jsx global>{`
        .avatar-uploader .ant-upload {
          width: 200px;
          height: 200px;
        }
        .ant-upload-select-picture-card i {
          font-size: 32px;
          color: #999;
        }
        .ant-upload-select-picture-card .ant-upload-text {
          margin-top: 8px;
          color: #666;
        }
        .ant-form-item-has-error .ant-upload {
          border-color: #ff4d4f;
        }
      `}</style>
    </div>
  );
};

export default BlogCMS;