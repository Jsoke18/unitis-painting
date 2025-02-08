"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  message,
  List,
  Tooltip,
  Popconfirm,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TagsOutlined,
  UploadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import type { ColumnsType } from 'antd/es/table';
import { calculateReadTime } from "@/lib/blogService";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

// Types and Interfaces
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  date: string;
}

interface CategoryCount {
  category: string;
  count: number;
}

// Image Upload Component
const ImageUpload: React.FC<{
  value?: string;
  onChange?: (url: string) => void;
}> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return false;
    }
    return true;
  };

  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setLoading(false);
      onChange?.(info.file.response.url);
      message.success("Image uploaded successfully");
    }
    if (info.file.status === "error") {
      setLoading(false);
      message.error("Image upload failed");
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
        <img
          src={value}
          alt="featured"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
          {loading ? (
            <LoadingOutlined style={{ fontSize: 24, marginBottom: 8 }} />
          ) : (
            <PlusOutlined style={{ fontSize: 24, marginBottom: 8 }} />
          )}
          <span>Upload</span>
        </div>
      )}
    </Upload>
  );
};

// Main Component
const BlogCMS = () => {
  // State Management
  const [form] = Form.useForm();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [content, setContent] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedRows, setSelectedRows] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Data
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blogs');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data.posts);
      setCategories(data.categories);
    } catch (error) {
      message.error('Failed to fetch posts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Debounced update: recalculate readTime 500ms after the user stops typing
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      form.setFieldsValue({ readTime: calculateReadTime(content) });
    }, 500); // Adjust delay as needed

    return () => clearTimeout(debounceTimeout);
  }, [content, form]);

  // Table Columns Definition
  const columns: ColumnsType<BlogPost> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "25%",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="truncate block max-w-xs">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "15%",
      filters: categories.map((cat) => ({ text: cat, value: cat })),
      onFilter: (value: string | number | boolean, record: BlogPost) =>
        record.category === value,
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "15%",
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "10%",
      render: (image: string) => (
        <img
          src={image}
          alt="thumbnail"
          className="w-16 h-16 object-cover rounded"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.jpg";
          }}
        />
      ),
    },
    {
      title: "Read Time",
      dataIndex: "readTime",
      key: "readTime",
      width: "10%",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: "20%",
      render: (tags: string[]) => (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Tag key={tag} color="green">
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, record: BlogPost) => (
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
            okButtonProps={{ loading }}
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              title="Delete post"
              loading={loading}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Post Management Handlers
  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setContent(post.content);
    form.setFieldsValue({
      ...post,
      tags: post.tags.join(", "),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (postId: number) => {
    try {
      setLoading(true);
      const response = await fetch('/api/blogs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete post');
      }
      
      message.success("Post deleted successfully");
      await fetchPosts();
    } catch (error) {
      message.error(error.message || "Failed to delete post");
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    Modal.confirm({
      title: `Delete ${selectedRows.length} posts?`,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        try {
          setLoading(true);
          const deletePromises = selectedRows.map(post => 
            fetch('/api/blogs', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: post.id }),
            }).then(async response => {
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete post');
              }
              return response;
            })
          );

          await Promise.all(deletePromises);
          message.success(`${selectedRows.length} posts deleted successfully`);
          setSelectedRows([]);
          await fetchPosts();
        } catch (error) {
          message.error(error.message || 'Failed to delete some posts');
          console.error('Bulk delete error:', error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // Overwrite any readTime value with the calculated value
      const postData = {
        ...values,
        content,
        tags: values.tags
          .split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean),
        readTime: calculateReadTime(content),
        author: "John Smith",
      };

      const method = editingPost ? 'PUT' : 'POST';
      const response = await fetch('/api/blogs', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPost ? { ...postData, id: editingPost.id } : postData),
      });

      if (!response.ok) throw new Error('Failed to save post');

      message.success(`Post ${editingPost ? 'updated' : 'created'} successfully`);
      handleModalClose();
      fetchPosts();
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Please check your input and try again");
    }
  };

  const handleModalClose = () => {
    form.resetFields();
    setContent("");
    setIsModalOpen(false);
    setEditingPost(null);
  };

  // Category Management Handlers
  const handleAddCategory = async () => {
    const trimmedCategory = newCategory.trim();
    if (!trimmedCategory) {
      message.error("Category name cannot be empty");
      return;
    }

    if (categories.includes(trimmedCategory)) {
      message.error("Category already exists");
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: trimmedCategory }),
      });

      if (!response.ok) throw new Error('Failed to add category');

      setNewCategory("");
      message.success("Category added successfully");
      fetchPosts(); // This will also fetch updated categories
    } catch (error) {
      message.error("Failed to add category");
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Blog Management</h1>
          <p className="text-gray-600">Manage your blog posts and categories</p>
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
            loading={loading}
          >
            Delete Selected
          </Button>
        </div>
      )}

      {/* Posts Table */}
      <Table
        loading={loading}
        columns={columns}
        dataSource={posts}
        rowKey="id"
        rowSelection={{
          onChange: (_: React.Key[], selectedRows: BlogPost[]) => {
            setSelectedRows(selectedRows);
          },
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} posts`,
        }}
      />

      {/* Post Edit/Create Modal */}
      <Modal
        title={editingPost ? "Edit Post" : "Create New Post"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalClose}
        width={800}
        confirmLoading={loading}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ readTime: "0 min read" }}
          className="overflow-visible"
        >
          <Form.Item
            name="image"
            label="Featured Image"
            rules={[{ required: true, message: "Please upload an image!" }]}
            tooltip="Upload a featured image for your blog post"
          >
            <ImageUpload />
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select>
                {categories.map((category) => (
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
                { required: true, message: "Please input the excerpt!" },
                { max: 300, message: "Excerpt is too long!" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
  
            <Form.Item
              label="Content"
              required
              tooltip="Rich text editor for the main content of your post"
              className="mb-16"
            >
              <div className="quill-wrapper">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  style={{ height: "200px" }}
                />
              </div>
            </Form.Item>
  
            <Form.Item
              name="tags"
              label="Tags"
              tooltip="Comma-separated list of tags"
              rules={[
                { required: true, message: "Please input at least one tag!" },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const tags = value.split(",").map((tag: string) => tag.trim());
                    if (tags.some((tag: string) => tag.length > 20)) {
                      return Promise.reject("Tags must be less than 20 characters");
                    }
                    if (tags.some((tag: string) => !tag)) {
                      return Promise.reject("Tags cannot be empty");
                    }
                    return Promise.resolve();
                  },
                },
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
              rules={[{ required: true, message: "Read time is required!" }]}
            >
              <Input disabled placeholder="Read time will update automatically" />
            </Form.Item>
          </Form>
        </Modal>
  
        {/* Category Management Modal */}
        <Modal
          title="Manage Categories"
          open={isCategoryModalOpen}
          onCancel={() => setIsCategoryModalOpen(false)}
          footer={null}
          bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
        >
          <div className="mb-4">
            <Input.Group compact>
              <Input
                style={{ width: "calc(100% - 100px)" }}
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
            renderItem={(category) => (
              <List.Item
                actions={[
                  <Popconfirm
                    key="delete"
                    title="Delete category?"
                    description={`This will affect ${
                      posts.filter((post) => post.category === category).length
                    } posts. They will be marked as "Uncategorized"`}
                    onConfirm={() => {
                      message.info("Category deletion not implemented in this version");
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>,
                ]}
              >
                <div className="flex items-center gap-2">
                  <Tag color="blue">{category}</Tag>
                  <span className="text-gray-500">
                    ({posts.filter((post) => post.category === category).length} posts)
                  </span>
                </div>
              </List.Item>
            )}
          />
        </Modal>
  
        {/* Style for Image Upload and Modal */}
        <style jsx global>{`
          /* Upload styles */
          .avatar-uploader .ant-upload {
            width: 200px !important;
            height: 200px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          
          .ant-upload-select-picture-card {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          .ant-upload-select-picture-card .ant-upload {
            padding: 0 !important;
          }
          
          /* Existing modal styles */
          .quill-wrapper {
            position: relative;
            z-index: 1;
          }
          
          .ql-editor {
            min-height: 200px;
          }
          
          .ql-toolbar.ql-snow {
            position: sticky;
            top: 0;
            z-index: 2;
            background: white;
          }
          
          .ant-modal-body {
            scrollbar-width: thin;
            scrollbar-color: #d9d9d9 #f5f5f5;
            padding: 24px;
          }
          
          .ant-modal-body::-webkit-scrollbar {
            width: 6px;
          }
          
          .ant-modal-body::-webkit-scrollbar-track {
            background: #f5f5f5;
          }
          
          .ant-modal-body::-webkit-scrollbar-thumb {
            background-color: #d9d9d9;
            border-radius: 3px;
          }
          
          .ant-form-item {
            margin-bottom: 24px;
          }
          
          .ant-modal-wrap {
            display: flex;
            align-items: flex-start;
            padding: 20px 0;
          }
          
          .ant-modal {
            top: 20px;
            padding-bottom: 0;
          }
          
          .ant-modal-footer {
            border-top: 1px solid #f0f0f0;
            padding: 16px 24px;
            background: white;
            border-radius: 0 0 8px 8px;
            position: sticky;
            bottom: 0;
            z-index: 1;
          }
          
          .ant-modal-content {
            max-height: calc(100vh - 40px);
            display: flex;
            flex-direction: column;
          }
          
          .ql-container.ql-snow {
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
          }
          
          .ql-toolbar.ql-snow {
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
          }
        `}</style>
      </div>
    );
  };
  
  export default BlogCMS;