"use client";

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Upload, 
  Button, 
  Tag, 
  Space, 
  message,
  Divider,
  Modal
} from 'antd';
import dynamic from 'next/dynamic';
import {
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
  DeleteOutlined,
  ExpandOutlined,
  CompressOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useBlogStore } from '@/lib/blogService';
import type { UploadFile } from 'antd/es/upload/interface';

// Import MDEditor dynamically to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => {
    const Editor = mod.default;
    return (props: any) => (
      <Editor
        {...props}
        previewOptions={{
          transformLinkUri: null,
          breaks: true,
          components: {
            // Override default header rendering to ensure proper spacing
            h1: props => <div>{'\n# ' + props.children + '\n'}</div>,
            h2: props => <div>{'\n## ' + props.children + '\n'}</div>,
            h3: props => <div>{'\n### ' + props.children + '\n'}</div>,
            h4: props => <div>{'\n#### ' + props.children + '\n'}</div>,
            h5: props => <div>{'\n##### ' + props.children + '\n'}</div>,
            h6: props => <div>{'\n###### ' + props.children + '\n'}</div>,
          }
        }}
      />
    );
  }),
  { ssr: false }
);

// Import MarkdownPreview for the preview modal
const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview'),
  { ssr: false }
);

const { TextArea } = Input;

interface BlogEditorProps {
  initialPost?: any;
  onSuccess?: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ initialPost, onSuccess }) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const addPost = useBlogStore((state) => state.addPost);
  const updatePost = useBlogStore((state) => state.updatePost);

  const categories = [
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Residential', label: 'Residential' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Color Selection', label: 'Color Selection' },
    { value: 'Painting Tips', label: 'Painting Tips' }
  ];

  // Initialize form with existing post data
  useEffect(() => {
    if (initialPost) {
      form.setFieldsValue({
        title: initialPost.title,
        category: initialPost.category,
        excerpt: initialPost.excerpt
      });
      setTags(initialPost.tags || []);
      setMarkdownContent(processMarkdownContent(initialPost.content || ''));
      setImageUrl(initialPost.image || null);
    }
  }, [initialPost, form]);

  // Process markdown content to ensure consistent line breaks
  const processMarkdownContent = (content: string): string => {
    if (!content) return '';

    return content
      // Normalize line endings
      .replace(/\r\n/g, '\n')
      // Ensure headers have proper spacing
      .replace(/^(#{1,6}\s.*?)$/gm, '\n$1\n')
      // Replace multiple consecutive line breaks with double line breaks
      .replace(/\n{3,}/g, '\n\n')
      // Ensure content starts and ends cleanly
      .trim();
  };

  // Tag handling
  const handleTagClose = (removedTag: string) => {
    setTags(tags.filter(tag => tag !== removedTag));
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
    setInputValue('');
  };

  // Image upload handling
  const uploadProps = {
    name: 'file',
    maxCount: 1,
    fileList: fileList,
    beforeUpload: (file: File) => {
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
    }
  };

  // Form submission
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const processedContent = processMarkdownContent(markdownContent);

      const blogData = {
        ...values,
        content: processedContent,
        tags,
        image: imageUrl || '/api/placeholder/1200/800',
        readTime: `${Math.ceil(processedContent.length / 1000)} min read`,
        author: 'Admin'
      };

      if (initialPost?.id) {
        await updatePost({ ...blogData, id: initialPost.id });
        message.success('Blog post updated successfully!');
      } else {
        await addPost(blogData);
        message.success('Blog post created successfully!');
      }

      onSuccess?.();
      
    } catch (error) {
      console.error('Error saving blog post:', error);
      message.error('Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    Modal.confirm({
      title: 'Are you sure you want to reset all fields?',
      onOk() {
        form.resetFields();
        setMarkdownContent('');
        setTags([]);
        setImageUrl(null);
        setFileList([]);
      }
    });
  };

  // Editor component
  const EditorComponent = (
    <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <div className={`${isFullScreen ? 'h-screen p-4' : ''}`}>
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
              {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            </Button>
          </Space>
        </div>
        <MDEditor
          value={markdownContent}
          onChange={(val: string | undefined) => {
            const processed = processMarkdownContent(val || '');
            setMarkdownContent(processed);
          }}
          height={isFullScreen ? 'calc(100vh - 120px)' : 500}
          preview="live"
          className="mb-4"
          previewOptions={{
            breaks: true,
            rehypePlugins: []
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {isFullScreen ? (
        EditorComponent
      ) : (
        <Card 
          title={initialPost ? "Edit Blog Post" : "Create Blog Post"} 
          className="max-w-4xl mx-auto"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Enter blog post title" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select
                placeholder="Select a category"
                options={categories}
              />
            </Form.Item>

            <Form.Item
              name="excerpt"
              label="Excerpt"
              rules={[{ required: true, message: 'Please enter an excerpt' }]}
            >
              <TextArea
                placeholder="Enter a brief description of the blog post"
                rows={3}
              />
            </Form.Item>

            <Form.Item
              label="Content"
              required
              help="Use Markdown to format your content. Click 'Full Screen' for a better editing experience."
            >
              {EditorComponent}
            </Form.Item>

            <Form.Item label="Featured Image">
              <Upload
                {...uploadProps}
                listType="picture-card"
                showUploadList={imageUrl ? false : true}
              >
                {imageUrl ? (
                  <div className="relative group">
                    <img src={imageUrl} alt="Featured" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <DeleteOutlined className="text-white text-xl" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <UploadOutlined />
                    <div className="mt-2">Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item label="Tags">
              <Space size={[0, 8]} wrap>
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => handleTagClose(tag)}
                    className="mr-1"
                  >
                    {tag}
                  </Tag>
                ))}
                {inputVisible ? (
                  <Input
                    type="text"
                    size="small"
                    className="w-20"
                    value={inputValue}
                    onChange={handleTagInputChange}
                    onBlur={handleTagInputConfirm}
                    onPressEnter={handleTagInputConfirm}
                    autoFocus
                  />
                ) : (
                  <Tag onClick={showTagInput} className="cursor-pointer">
                    <PlusOutlined /> New Tag
                  </Tag>
                )}
              </Space>
            </Form.Item>

            <Divider />

            <Form.Item className="flex justify-end mb-0">
              <Space>
                <Button onClick={handleReset}>
                  Reset
                </Button>
                <Button 
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={loading}
                  onClick={() => form.submit()}
                >
                  {initialPost ? 'Update Post' : 'Publish Post'}
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
              "data-color-mode": "light"
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default BlogEditor;