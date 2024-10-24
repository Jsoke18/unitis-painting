
import React, { useState } from 'react';
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
  Divider
} from 'antd';
import {
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { TextArea } = Input;

const BlogEditor = () => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'commercial', label: 'Commercial' },
    { value: 'residential', label: 'Residential' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'color-selection', label: 'Color Selection' },
    { value: 'painting-tips', label: 'Painting Tips' }
  ];

  const handleTagClose = (removedTag) => {
    setTags(tags.filter(tag => tag !== removedTag));
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const uploadProps = {
    name: 'file',
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      return false; // Prevent actual upload
    },
    onRemove: () => {
      setImageUrl(null);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const blogData = {
        ...values,
        tags,
        image: imageUrl
      };
      console.log('Blog post data:', blogData);
      // Add your API call here
      message.success('Blog post saved successfully!');
    } catch (error) {
      message.error('Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card title="Create Blog Post" className="max-w-4xl mx-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'draft'
          }}
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
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter the content' }]}
          >
            <TextArea
              placeholder="Write your blog post content here..."
              rows={15}
            />
          </Form.Item>

          <Form.Item
            label="Featured Image"
            required
          >
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
              {tags.map((tag, index) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleTagClose(tag)}
                  style={{ marginRight: 3 }}
                >
                  {tag}
                </Tag>
              ))}
              {inputVisible ? (
                <Input
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                  autoFocus
                />
              ) : (
                <Tag onClick={showInput} className="cursor-pointer">
                  <PlusOutlined /> New Tag
                </Tag>
              )}
            </Space>
          </Form.Item>

          <Divider />

          <Form.Item className="flex justify-end">
            <Space>
              <Button onClick={() => form.resetFields()}>
                Reset
              </Button>
              <Button type="primary" ghost onClick={() => form.submit()}>
                Save as Draft
              </Button>
              <Button 
                type="primary"
                icon={<SaveOutlined />}
                loading={loading}
                onClick={() => form.submit()}
              >
                Publish Post
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BlogEditor;