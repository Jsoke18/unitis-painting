"use client";
import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Card,
  Button,
  message,
  Spin,
  Alert,
  Tabs,
  InputNumber,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { SettingOutlined, SaveOutlined, LineChartOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { TabPane } = Tabs;

interface StatsSettings {
  totalProjects: number;
  yearsInBusiness: number;
  serviceAreas: number;
  averageRating: number;
}

interface TextSettings {
  mainHeading: string;
  mainSubheading: string;
  statsSubtext: string;
  averageRatingText: string;
  customerStoriesLabel: string;
  callTitle: string;
  callSubtitle: string;
  formNameLabel: string;
  formNamePlaceholder: string;
  formEmailLabel: string;
  formEmailPlaceholder: string;
  formMessageLabel: string;
  formMessagePlaceholder: string;
  formSubmitText: string;
  formSuccessMessage: string;
  formErrorMessage: string;
  directCallText: string;
  phoneNumber: string;
}

interface Settings {
  stats: StatsSettings;
  text: TextSettings;
}

const defaultSettings: Settings = {
  stats: {
    totalProjects: 4000,
    yearsInBusiness: 15,
    serviceAreas: 12,
    averageRating: 4.9
  },
  text: {
    mainHeading: "What Our Clients Say",
    mainSubheading: "Read experiences from our valued customers",
    statsSubtext: "Serving Calgary, Kewlona, and the Greater Vancouver since 2009",
    averageRatingText: "Average Customer Rating",
    customerStoriesLabel: "Customer Stories",
    callTitle: "We're Here to Help",
    callSubtitle: "Have questions about your painting project? Need a quote or assistance?",
    formNameLabel: "Name",
    formNamePlaceholder: "Your name",
    formEmailLabel: "Email",
    formEmailPlaceholder: "Your email",
    formMessageLabel: "Message",
    formMessagePlaceholder: "Tell us about your project...",
    formSubmitText: "Send Message",
    formSuccessMessage: "Thanks for reaching out! We'll get back to you shortly.",
    formErrorMessage: "There was an error sending your message. Please try again.",
    directCallText: "Call us directly",
    phoneNumber: "604-357-4787"
  }
};

export default function SettingsPage() {
  const [statsForm] = Form.useForm();
  const [textForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("stats");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const savedSettings = localStorage.getItem('siteSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        statsForm.setFieldsValue(settings.stats);
        textForm.setFieldsValue(settings.text);
      } else {
        statsForm.setFieldsValue(defaultSettings.stats);
        textForm.setFieldsValue(defaultSettings.text);
      }
    } catch (error) {
      message.error('Failed to load settings');
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formType: 'stats' | 'text', values: any) => {
    setLoading(true);
    try {
      const savedSettings = JSON.parse(localStorage.getItem('siteSettings') || JSON.stringify(defaultSettings));
      const updatedSettings = {
        ...savedSettings,
        [formType]: values
      };
      
      localStorage.setItem('siteSettings', JSON.stringify(updatedSettings));
      message.success('Settings updated successfully');
    } catch (error) {
      message.error('Failed to update settings');
      console.error('Error updating settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !statsForm.getFieldsValue()) {
    return <Spin size="large" className="flex justify-center items-center min-h-screen" />;
  }

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <SettingOutlined className="text-xl" />
            <span>Site Settings</span>
          </div>
        }
        className="max-w-4xl mx-auto"
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={[
            {
              key: 'stats',
              label: (
                <span>
                  <LineChartOutlined />
                  Statistics
                </span>
              ),
              children: (
                <Form
                  form={statsForm}
                  layout="vertical"
                  onFinish={(values) => handleSubmit('stats', values)}
                  className="py-4"
                >
                  <Alert
                    message="Statistics Configuration"
                    description="Configure the statistics displayed across the website."
                    type="info"
                    showIcon
                    className="mb-6"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item
                      name="totalProjects"
                      label="Total Projects"
                      rules={[{ required: true, message: 'Please input total projects' }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="yearsInBusiness"
                      label="Years in Business"
                      rules={[{ required: true, message: 'Please input years in business' }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="serviceAreas"
                      label="Service Areas"
                      rules={[{ required: true, message: 'Please input service areas' }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="averageRating"
                      label="Average Rating"
                      rules={[{ required: true, message: 'Please input average rating' }]}
                    >
                      <InputNumber min={0} max={5} step={0.1} className="w-full" />
                    </Form.Item>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={loading}
                      className="bg-blue-600 hover:bg-blue-500"
                    >
                      Save Statistics
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'text',
              label: (
                <span>
                  <SettingOutlined />
                  Text Content
                </span>
              ),
              children: (
                <Form
                  form={textForm}
                  layout="vertical"
                  onFinish={(values) => handleSubmit('text', values)}
                  className="py-4"
                >
                  <Alert
                    message="Text Content Configuration"
                    description="Configure the text content displayed across the website."
                    type="info"
                    showIcon
                    className="mb-6"
                  />
                  
                  {Object.entries(defaultSettings.text).map(([key, value]) => (
                    <Form.Item
                      key={key}
                      name={key}
                      label={key.replace(/([A-Z])/g, ' $1').trim()}
                      rules={[{ required: true, message: `Please input ${key}` }]}
                    >
                      {value.length > 50 ? (
                        <TextArea rows={4} />
                      ) : (
                        <Input />
                      )}
                    </Form.Item>
                  ))}

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={loading}
                      className="bg-blue-600 hover:bg-blue-500"
                    >
                      Save Text Content
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}