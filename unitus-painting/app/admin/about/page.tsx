'use client';
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Space, Card, Typography, List } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { AboutContent, defaultAboutContent } from '@/app/types/about';

const { TextArea } = Input;
const { Title } = Typography;

const AboutCMS: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/about');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        form.setFieldsValue({
          ...data,
          paragraphs: data.paragraphs || [],
          bulletPoints: data.bulletPoints || []
        });
      } catch (error) {
        console.error('Error fetching content:', error);
        message.error('Failed to load content. Loading default values.');
        form.setFieldsValue(defaultAboutContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [form]);

  const onFinish = async (values: AboutContent) => {
    try {
      setSaving(true);
      const response = await fetch('/api/about', {
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

  const onReset = () => {
    form.setFieldsValue(defaultAboutContent);
    message.info('Form reset to default values');
  };

  return (
    <Card className="max-w-4xl mx-auto my-8">
      <Title level={2} className="mb-8">About Us Content Management</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={loading}
        initialValues={defaultAboutContent}
      >
        <Card title="Badge & Heading" className="mb-8">
          <Form.Item
            label="Badge Text"
            name={['badge', 'text']}
            rules={[{ required: true, message: 'Please input the badge text!' }]}
          >
            <Input placeholder="Enter badge text" />
          </Form.Item>

          <Form.Item
            label="Heading"
            name="heading"
            rules={[{ required: true, message: 'Please input the heading!' }]}
          >
            <Input placeholder="Enter heading" />
          </Form.Item>
        </Card>

        <Card title="Video Settings" className="mb-8">
          <Form.Item
            label="Video URL"
            name="videoUrl"
            rules={[
              { required: true, message: 'Please input the video URL!' },
              { type: 'url', message: 'Please enter a valid URL!' }
            ]}
          >
            <Input placeholder="Enter Vimeo video URL" />
          </Form.Item>
        </Card>

        <Card title="Paragraphs" className="mb-8">
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
                        autoSize={{ minRows: 2, maxRows: 6 }}
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
                    Add Bullet Point
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

export default AboutCMS;