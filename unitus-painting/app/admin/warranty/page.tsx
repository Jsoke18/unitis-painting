'use client';

import React from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  message,
  Divider,
  Typography,
  Spin,
  Modal,
} from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Shield } from 'lucide-react';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

interface WarrantySection {
  title: string;
  icon: string;
  content: string[];
}

interface WarrantyData {
  hero: {
    title: string;
    subtitle: string;
  };
  sections: WarrantySection[];
}

const WarrantyCMS: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchWarrantyData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/warranty');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch warranty data');
      }
      
      const data: WarrantyData = await response.json();
      
      // Transform the data for the form
      form.setFieldsValue({
        hero: data.hero,
        sections: data.sections.map(section => ({
          ...section,
          content: Array.isArray(section.content) 
            ? section.content.join('\n\n')
            : section.content
        }))
      });
    } catch (error) {
      messageApi.error({
        content: error instanceof Error ? error.message : 'Failed to load warranty data',
        duration: 5
      });
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWarrantyData();
  }, []);

  const validateContent = (values: any): boolean => {
    // Validate hero section
    if (!values.hero?.title?.trim() || !values.hero?.subtitle?.trim()) {
      messageApi.error('Hero section title and subtitle are required');
      return false;
    }

    // Validate warranty sections
    if (!Array.isArray(values.sections) || values.sections.length === 0) {
      messageApi.error('At least one warranty section is required');
      return false;
    }

    for (const section of values.sections) {
      if (!section.title?.trim()) {
        messageApi.error('All sections must have a title');
        return false;
      }
      if (!section.content?.trim()) {
        messageApi.error('All sections must have content');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (values: any) => {
    if (!validateContent(values)) {
      return;
    }

    confirm({
      title: 'Are you sure you want to update the warranty content?',
      icon: <ExclamationCircleOutlined />,
      content: 'This will update the content visible to all users.',
      okText: 'Yes, Update',
      okType: 'primary',
      cancelText: 'No, Cancel',
      onOk: async () => {
        try {
          setSaving(true);
          
          // Transform the data for the API
          const formattedData = {
            hero: values.hero,
            sections: values.sections.map((section: any) => ({
              ...section,
              content: section.content
                .split('\n\n')
                .map((text: string) => text.trim())
                .filter(Boolean)
            }))
          };

          const response = await fetch('/api/warranty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update warranty data');
          }

          const result = await response.json();

          if (result.success) {
            messageApi.success({
              content: 'Warranty content updated successfully',
              duration: 3
            });
            
            // Refresh the data to ensure we're showing the latest version
            await fetchWarrantyData();
          } else {
            throw new Error(result.error || 'Update failed');
          }
        } catch (error) {
          messageApi.error({
            content: error instanceof Error ? error.message : 'Failed to update warranty content',
            duration: 5
          });
          console.error('Submit error:', error);
        } finally {
          setSaving(false);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading warranty content..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {contextHolder}
      
      <Card className="mb-8">
        <Title level={2} className="mb-4">
          <Shield className="inline-block mr-2 mb-1" />
          Warranty Content Management
        </Title>
        <Text className="text-gray-500">
          Update the warranty page content and sections. Changes will be reflected immediately on the public warranty page.
        </Text>
      </Card>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          sections: [{ title: '', icon: 'Shield', content: '' }]
        }}
      >
        {/* Hero Section */}
        <Card title="Hero Section" className="mb-8">
          <Form.Item
            name={['hero', 'title']}
            label="Main Title"
            rules={[{ required: true, message: 'Please enter the main title' }]}
          >
            <Input placeholder="e.g., We've Got You Covered" />
          </Form.Item>

          <Form.Item
            name={['hero', 'subtitle']}
            label="Subtitle"
            rules={[{ required: true, message: 'Please enter the subtitle' }]}
          >
            <Input placeholder="e.g., Our warranty reflects our commitment..." />
          </Form.Item>
        </Card>

        {/* Warranty Sections */}
        <Card title="Warranty Sections" className="mb-8">
          <Form.List 
            name="sections"
            rules={[
              {
                validator: async (_, sections) => {
                  if (!sections || sections.length < 1) {
                    return Promise.reject(new Error('At least one section is required'));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div key={field.key}>
                    {index > 0 && <Divider />}
                    <div className="flex justify-between items-center mb-4">
                      <Title level={5}>Section {index + 1}</Title>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                        >
                          Remove Section
                        </Button>
                      )}
                    </div>

                    <Form.Item
                      {...field}
                      name={[field.name, 'title']}
                      label="Section Title"
                      rules={[{ required: true, message: 'Please enter the section title' }]}
                    >
                      <Input placeholder="e.g., Two-Year Warranty" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'icon']}
                      label="Icon"
                      initialValue="Shield"
                      hidden
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'content']}
                      label="Content"
                      rules={[{ required: true, message: 'Please enter the section content' }]}
                      extra="Separate paragraphs with a blank line (double enter)"
                    >
                      <TextArea
                        rows={6}
                        placeholder="Enter the section content here..."
                      />
                    </Form.Item>
                  </div>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Section
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={saving}
            size="large"
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default WarrantyCMS;