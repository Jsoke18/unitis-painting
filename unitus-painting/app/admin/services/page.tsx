'use client';
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Space, Card, Typography, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { ServicesContent, defaultServicesContent, Service } from '@/app/types/services';
import type { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Title } = Typography;

const ServicesCMS: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        form.setFieldsValue(data);
      } catch (error) {
        console.error('Error fetching content:', error);
        message.error('Failed to load content. Loading default values.');
        form.setFieldsValue(defaultServicesContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [form]);

  const onFinish = async (values: ServicesContent) => {
    try {
      setSaving(true);
      const response = await fetch('/api/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update content');
      
      message.success('Services content updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      message.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  const onReset = () => {
    form.setFieldsValue(defaultServicesContent);
    message.info('Form reset to default values');
  };

  return (
    <Card className="max-w-5xl mx-auto my-8">
      <Title level={2} className="mb-8">Services Content Management</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={loading}
        initialValues={defaultServicesContent}
      >
        <Card title="Main Content" className="mb-8">
          <Form.Item
            label="Heading"
            name="heading"
            rules={[{ required: true, message: 'Please input the heading!' }]}
          >
            <Input placeholder="Enter section heading" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <TextArea 
              placeholder="Enter section description"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>
        </Card>

        <Card title="Services" className="mb-8">
          <Form.List name="services">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card 
                    key={field.key} 
                    title={`Service ${index + 1}`}
                    className="mb-4"
                    extra={
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => remove(field.name)}
                      />
                    }
                  >
                    <Form.Item
                      {...field}
                      label="Icon URL"
                      name={[field.name, 'icon']}
                      rules={[{ required: true, message: 'Please input the icon URL!' }]}
                    >
                      <Input placeholder="Enter icon URL" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Label"
                      name={[field.name, 'label']}
                      rules={[{ required: true, message: 'Please input the label!' }]}
                    >
                      <Input placeholder="Enter label (e.g., COMMERCIAL)" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Title"
                      name={[field.name, 'title']}
                      rules={[{ required: true, message: 'Please input the title!' }]}
                    >
                      <Input placeholder="Enter title" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Description"
                      name={[field.name, 'description']}
                      rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                      <TextArea 
                        placeholder="Enter service description"
                        autoSize={{ minRows: 2, maxRows: 4 }}
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Image URL"
                      name={[field.name, 'imageSrc']}
                      rules={[{ required: true, message: 'Please input the image URL!' }]}
                    >
                      <Input placeholder="Enter image URL" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Link"
                      name={[field.name, 'link']}
                      rules={[{ required: true, message: 'Please input the link!' }]}
                    >
                      <Input placeholder="Enter page link (e.g., /services/commercial-services)" />
                    </Form.Item>
                  </Card>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    block
                  >
                    Add Service
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={saving}>
              Save Changes
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset to Default
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ServicesCMS;