'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, Tabs, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { CommitmentContent } from '@/types/Commitment';

const { Title } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const CommitmentCMS: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/commitment');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        form.setFieldsValue(data);
      } catch (error) {
        console.error('Error fetching content:', error);
        message.error('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [form]);

  const onFinish = async (values: CommitmentContent) => {
    try {
      setSaving(true);
      const response = await fetch('/api/commitment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update content');
      
      message.success('Content updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      message.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  const onReset = async () => {
    try {
      const response = await fetch('/api/commitment');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      form.setFieldsValue(data);
      message.success('Form reset to default values');
    } catch (error) {
      console.error('Error resetting form:', error);
      message.error('Failed to reset form');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="mb-0">Commitment Section Management</Title>
          <Space>
            <Button htmlType="button" onClick={onReset}>
              Reset to Default
            </Button>
            <Button 
              type="primary" 
              onClick={() => form.submit()} 
              loading={saving}
            >
              Save Changes
            </Button>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
        >
          <Tabs
            defaultActiveKey="1"
            type="card"
            className="mb-6"
            items={[
              {
                key: "1",
                label: "Content",
                children: (
                  <div className="py-4">
                    <Form.Item
                      label="Title"
                      name="title"
                      rules={[{ required: true, message: 'Please input the title!' }]}
                    >
                      <Input placeholder="Enter section title" />
                    </Form.Item>

                    <Form.List name="paragraphs">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map((field, index) => (
                            <Space key={field.key} className="flex mb-4">
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: "Please input paragraph content or delete this field.",
                                  },
                                ]}
                                className="mb-0 flex-1"
                              >
                                <TextArea 
                                  placeholder={`Paragraph ${index + 1}`}
                                  autoSize={{ minRows: 3, maxRows: 6 }}
                                />
                              </Form.Item>
                              <DeleteOutlined 
                                onClick={() => remove(field.name)} 
                                className="text-red-500 cursor-pointer" 
                              />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              icon={<PlusOutlined />}
                              block
                            >
                              Add Paragraph
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </div>
                ),
              },
              {
                key: "2",
                label: "Button",
                children: (
                  <div className="py-4">
                    <Form.Item
                      label="Button Text"
                      name={['button', 'text']}
                      rules={[{ required: true, message: 'Please input the button text!' }]}
                    >
                      <Input placeholder="Enter button text" />
                    </Form.Item>

                    <Form.Item
                      label="Button Link"
                      name={['button', 'link']}
                      rules={[{ required: true, message: 'Please input the button link!' }]}
                    >
                      <Input placeholder="Enter button link" />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: "3",
                label: "Image",
                children: (
                  <div className="py-4">
                    <Form.Item
                      label="Image URL"
                      name={['image', 'src']}
                      rules={[{ required: true, message: 'Please input the image URL!' }]}
                    >
                      <Input placeholder="Enter image URL" />
                    </Form.Item>

                    <Form.Item
                      label="Image Alt Text"
                      name={['image', 'alt']}
                      rules={[{ required: true, message: 'Please input the image alt text!' }]}
                    >
                      <Input placeholder="Enter image alt text" />
                    </Form.Item>
                  </div>
                ),
              },
            ]}
          />
        </Form>
      </Card>
    </div>
  );
};

export default CommitmentCMS;