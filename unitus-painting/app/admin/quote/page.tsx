// app/admin/quote/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Space, Card, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { QuoteContent, defaultQuoteContent, ProjectType } from '@/app/types/quote';

const { Title } = Typography;
const { TextArea } = Input;

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
        message.error('Failed to load content. Loading default values.');
        form.setFieldsValue(defaultQuoteContent);
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
    form.setFieldsValue(defaultQuoteContent);
    message.info('Form reset to default values');
  };

  return (
    <Card className="max-w-4xl mx-auto my-8">
      <Title level={2} className="mb-8">Get Quote Section Management</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={loading}
        initialValues={defaultQuoteContent}
      >
        <Card title="Main Content" className="mb-8">
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
        </Card>

        <Card title="Bullet Points" className="mb-8">
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
        </Card>

        <Card title="Form Labels" className="mb-8">
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
        </Card>

        <Card title="Project Types" className="mb-8">
          <Form.List name="projectTypes">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card 
                    key={field.key} 
                    className="mb-4"
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

export default QuoteCMS;