'use client';
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Space, Card, Typography, Tabs } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { QuoteContent, ProjectType } from '@/app/types/quote';

const { Title } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const QuoteCMS: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/quote');
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

  const onFinish = async (values: QuoteContent) => {
    try {
      setSaving(true);
      const response = await fetch('/api/quote', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update content');
      
      message.success('Quote content updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      message.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  const onReset = () => {
    const fetchDefaultContent = async () => {
      try {
        const response = await fetch('/api/quote');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        form.setFieldsValue(data);
        message.success('Form reset to default values');
      } catch (error) {
        console.error('Error resetting form:', error);
        message.error('Failed to reset form');
      }
    };
    fetchDefaultContent();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="mb-0">Quote Section Management</Title>
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
                label: "Main Content",
                children: (
                  <div className="py-4">
                    <Form.Item
                      label="Heading"
                      name="heading"
                      rules={[{ required: true, message: 'Please input the heading!' }]}
                    >
                      <Input placeholder="Enter heading" />
                    </Form.Item>

                    <Form.Item
                      label="Description"
                      name="description"
                      rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                      <TextArea 
                        placeholder="Enter description"
                        autoSize={{ minRows: 3, maxRows: 6 }}
                      />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: "2",
                label: "Bullet Points",
                children: (
                  <div className="py-4">
                    <Form.List name="bulletPoints">
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
                                    message: "Please input bullet point content or delete this field.",
                                  },
                                ]}
                                className="mb-0 flex-1"
                              >
                                <Input placeholder={`Bullet point ${index + 1}`} />
                              </Form.Item>
                              <DeleteOutlined onClick={() => remove(field.name)} className="text-red-500 cursor-pointer" />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              icon={<PlusOutlined />}
                              block
                            >
                              Add Bullet Point
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </div>
                ),
              },
              {
                key: "3",
                label: "Form Labels",
                children: (
                  <div className="py-4">
                    <Form.Item
                      label="Name Placeholder"
                      name={['formLabels', 'name']}
                      rules={[{ required: true, message: 'Please input the name placeholder!' }]}
                    >
                      <Input placeholder="Enter name field placeholder" />
                    </Form.Item>

                    <Form.Item
                      label="Email Placeholder"
                      name={['formLabels', 'email']}
                      rules={[{ required: true, message: 'Please input the email placeholder!' }]}
                    >
                      <Input placeholder="Enter email field placeholder" />
                    </Form.Item>

                    <Form.Item
                      label="Phone Placeholder"
                      name={['formLabels', 'phone']}
                      rules={[{ required: true, message: 'Please input the phone placeholder!' }]}
                    >
                      <Input placeholder="Enter phone field placeholder" />
                    </Form.Item>

                    <Form.Item
                      label="Project Type Placeholder"
                      name={['formLabels', 'projectType']}
                      rules={[{ required: true, message: 'Please input the project type placeholder!' }]}
                    >
                      <Input placeholder="Enter project type field placeholder" />
                    </Form.Item>

                    <Form.Item
                      label="Submit Button Text"
                      name={['formLabels', 'submitButton']}
                      rules={[{ required: true, message: 'Please input the submit button text!' }]}
                    >
                      <Input placeholder="Enter submit button text" />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: "4",
                label: "Project Types",
                children: (
                  <div className="py-4">
                    <Form.List name="projectTypes">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map((field, index) => (
                            <Card 
                              key={field.key} 
                              className="mb-4"
                              size="small"
                              title={`Project Type ${index + 1}`}
                              extra={
                                <DeleteOutlined 
                                  onClick={() => remove(field.name)} 
                                  className="text-red-500 cursor-pointer"
                                />
                              }
                            >
                              <Space direction="vertical" className="w-full">
                                <Form.Item
                                  {...field}
                                  label="Value"
                                  name={[field.name, 'value']}
                                  rules={[{ required: true, message: 'Please input the value!' }]}
                                >
                                  <Input placeholder="Enter value (e.g., residential)" />
                                </Form.Item>

                                <Form.Item
                                  {...field}
                                  label="Label"
                                  name={[field.name, 'label']}
                                  rules={[{ required: true, message: 'Please input the label!' }]}
                                >
                                  <Input placeholder="Enter label (e.g., Residential)" />
                                </Form.Item>
                              </Space>
                            </Card>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              icon={<PlusOutlined />}
                              block
                            >
                              Add Project Type
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
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

export default QuoteCMS;