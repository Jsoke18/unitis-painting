"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Divider,
  Table,
  Space,
  Modal,
  message,
  Form,
  Input,
  Select,
  Upload,
  Tag,
} from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  ExpandOutlined,
  CompressOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import type { UploadFile } from "antd/es/upload/interface";
import type { BlogPost } from "@/lib/db";

const { TextArea } = Input;

// Dynamic imports for Markdown editor
const MDEditor = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      const Editor = mod.default;
      return (props: any) => (
        <Editor
          {...props}
          previewOptions={{
            transformLinkUri: null,
            breaks: true,
            components: {
              h1: (props) => <div>{"\n# " + props.children + "\n"}</div>,
              h2: (props) => <div>{"\n## " + props.children + "\n"}</div>,
              h3: (props) => <div>{"\n### " + props.children + "\n"}</div>,
              h4: (props) => <div>{"\n#### " + props.children + "\n"}</div>,
              h5: (props) => <div>{"\n##### " + props.children + "\n"}</div>,
              h6: (props) => <div>{"\n###### " + props.children + "\n"}</div>,
            },
          }}
        />
      );
    }),
  { ssr: false }
);

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

// Main Component
const BlogAdminPage = () => {
  // States for managing view modes
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | undefined>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  // States for editor
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [saving, setSaving] = useState(false);

  const categories = [
    { value: "Commercial", label: "Commercial" },
    { value: "Residential", label: "Residential" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Color Selection", label: "Color Selection" },
    { value: "Painting Tips", label: "Painting Tips" },
  ];

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Initialize form with selected post data
  useEffect(() => {
    if (selectedPost) {
      form.setFieldsValue({
        title: selectedPost.title,
        category: selectedPost.category,
        excerpt: selectedPost.excerpt,
      });
      setTags(selectedPost.tags || []);
      setMarkdownContent(processMarkdownContent(selectedPost.content || ""));
      setImageUrl(selectedPost.image || null);
    }
  }, [selectedPost, form]);

  // Fetch posts function
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blogs");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      message.error("Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  };

  // Process markdown content
  const processMarkdownContent = (content: string): string => {
    if (!content) return "";
    return content
      .replace(/\r\n/g, "\n")
      .replace(/^(#{1,6}\s.*?)$/gm, "\n$1\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  // Calculate read time
  const calculateReadTime = (content: string): string => {
    if (!content) return "0 min read";
    const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;
    const minutes = Math.ceil(wordCount / 200); // using an average reading speed of 200 words per minute
    return `${minutes} min read`;
  };

  // Handle post deletion
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this post?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      onOk: async () => {
        try {
          const response = await fetch("/api/blogs", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });

          if (!response.ok) throw new Error("Failed to delete post");

          message.success("Post deleted successfully");
          await fetchPosts();
        } catch (error) {
          console.error("Error deleting post:", error);
          message.error("Failed to delete post");
        }
      },
    });
  };

  // Tag handling
  const handleTagClose = (removedTag: string) => {
    setTags(tags.filter((tag) => tag !== removedTag));
  };

  const showTagInput = () => {
    setInputVisible(true);
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleTagInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  // Image upload handling
  const uploadProps = {
    name: "file",
    maxCount: 1,
    fileList: fileList,
    beforeUpload: (file: File) => {
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

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      return false;
    },
    onChange: ({ fileList }: { fileList: UploadFile[] }) => {
      setFileList(fileList);
    },
    onRemove: () => {
      setImageUrl(null);
      setFileList([]);
    },
  };

  // Form submission
  const onFinish = async (values: any) => {
    try {
      setSaving(true);
      const processedContent = processMarkdownContent(markdownContent);

      if (!processedContent) {
        message.error("Content cannot be empty");
        return;
      }

      const blogData = {
        title: values.title,
        category: values.category,
        excerpt: values.excerpt,
        content: processedContent,
        tags,
        image: imageUrl || "/api/placeholder/1200/800",
        readTime: calculateReadTime(processedContent),
        author: "John Smith",
      };

      const response = await fetch("/api/blogs", {
        method: selectedPost ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          selectedPost ? { ...blogData, id: selectedPost.id } : blogData
        ),
      });

      if (!response.ok) throw new Error("Failed to save blog post");

      message.success(
        `Blog post ${selectedPost ? "updated" : "created"} successfully!`
      );

      if (!selectedPost) {
        resetForm();
      }

      setIsEditing(false);
      setSelectedPost(undefined);
      fetchPosts();
    } catch (error) {
      console.error("Error saving blog post:", error);
      message.error("Failed to save blog post");
    } finally {
      setSaving(false);
    }
  };

  // Reset form
  const resetForm = () => {
    form.resetFields();
    setMarkdownContent("");
    setTags([]);
    setImageUrl(null);
    setFileList([]);
  };

  const handleReset = () => {
    Modal.confirm({
      title: "Are you sure you want to reset all fields?",
      content: "This will clear all entered data and cannot be undone.",
      onOk: resetForm,
    });
  };

  // Table columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "30%",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "15%",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: "20%",
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags?.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "15%",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (_: any, record: BlogPost) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedPost(record);
              setIsEditing(true);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Editor component
  const EditorComponent = (
    <div className={`${isFullScreen ? "fixed inset-0 z-50 bg-white" : ""}`}>
      <div className={`${isFullScreen ? "h-screen p-4" : ""}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Content Editor</h2>
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => setIsPreviewModalVisible(true)}
            >
              Preview
            </Button>
            <Button
              icon={isFullScreen ? <CompressOutlined /> : <ExpandOutlined />}
              onClick={() => setIsFullScreen(!isFullScreen)}
            >
              {isFullScreen ? "Exit Full Screen" : "Full Screen"}
            </Button>
          </Space>
        </div>
        <MDEditor
          value={markdownContent}
          onChange={(val: string | undefined) => {
            const processed = processMarkdownContent(val || "");
            setMarkdownContent(processed);
          }}
          height={isFullScreen ? "calc(100vh - 120px)" : 500}
          preview="live"
          className="mb-4"
        />
      </div>
    </div>
  );

  // Render editor view
  if (isEditing) {
    return (
      <div className="p-6">
        {isFullScreen ? (
          EditorComponent
        ) : (
          <Card
            title={selectedPost ? "Edit Blog Post" : "Create Blog Post"}
            className="max-w-4xl mx-auto"
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please enter a title" }]}
              >
                <Input placeholder="Enter blog post title" />
              </Form.Item>

              <Form.Item
                name="category"
                label="Category"
                rules={[
                  { required: true, message: "Please select a category" },
                ]}
              >
                <Select placeholder="Select a category" options={categories} />
              </Form.Item>

              <Form.Item
                name="excerpt"
                label="Excerpt"
                rules={[{ required: true, message: "Please enter an excerpt" }]}
              >
                <TextArea rows={3} placeholder="Enter a brief description" />
              </Form.Item>

              <Form.Item label="Content" required>
                {EditorComponent}
              </Form.Item>
              <Form.Item label="Featured Image">
                <Upload {...uploadProps} listType="picture-card">
                  {imageUrl ? (
                    <div className="relative group">
                      <img
                        src={imageUrl}
                        alt="Featured"
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 
                      group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <DeleteOutlined className="text-white text-xl" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-20">
                      <div className="flex flex-col items-center">
                        <UploadOutlined className="text-2xl mb-2" />
                        <span>Upload</span>
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item label="Tags">
                <Space size={[0, 8]} wrap>
                  {tags.map((tag) => (
                    <Tag key={tag} closable onClose={() => handleTagClose(tag)}>
                      {tag}
                    </Tag>
                  ))}
                  {inputVisible ? (
                    <Input
                      type="text"
                      size="small"
                      value={inputValue}
                      onChange={handleTagInputChange}
                      onBlur={handleTagInputConfirm}
                      onPressEnter={handleTagInputConfirm}
                      autoFocus
                      style={{ width: 78 }}
                    />
                  ) : (
                    <Tag onClick={showTagInput}>
                      <PlusOutlined /> New Tag
                    </Tag>
                  )}
                </Space>
              </Form.Item>

              <Divider />

              <Form.Item className="flex justify-end mb-0">
                <Space>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedPost(undefined);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleReset}>Reset</Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={saving}
                    onClick={() => form.submit()}
                  >
                    {selectedPost ? "Update Post" : "Publish Post"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        )}

        {/* Preview Modal */}
        <Modal
          title="Preview Blog Post"
          open={isPreviewModalVisible}
          onCancel={() => setIsPreviewModalVisible(false)}
          width={1000}
          footer={null}
        >
          <div className="prose max-w-none">
            <MarkdownPreview
              source={markdownContent}
              wrapperElement={{
                "data-color-mode": "light",
              }}
            />
          </div>
        </Modal>
      </div>
    );
  }

  // Render list view
  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsEditing(true);
              setSelectedPost(undefined);
              resetForm();
            }}
          >
            Create New Post
          </Button>
        </div>
        <Divider />
        <Table
          columns={columns}
          dataSource={posts}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
};

export default BlogAdminPage;
