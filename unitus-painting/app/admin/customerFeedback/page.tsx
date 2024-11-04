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
import { SettingOutlined, SaveOutlined, LineChartOutlined, CommentOutlined } from '@ant-design/icons';
import { Star } from 'lucide-react';

const { TextArea } = Input;
const { TabPane } = Tabs;

interface Review {
  id: string;
  author: string;
  location?: string;
  date: string;
  text: string;
  rating: number;
}

interface ReviewSettings {
  maxDisplayLength: number;
  reviewsPerPage: number;
  enableRatings: boolean;
  showDate: boolean;
}

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
  readMoreText: string;
  showLessText: string;
}

interface Settings {
  stats: StatsSettings;
  text: TextSettings;
  reviews: ReviewSettings;
}

const ReviewCard = ({ review, settings, textSettings }: { 
  review: Review; 
  settings: ReviewSettings;
  textSettings: TextSettings;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const shouldTruncate = review.text.length > settings.maxDisplayLength;
  const truncatedText = shouldTruncate
    ? review.text.slice(0, settings.maxDisplayLength).split(' ').slice(0, -1).join(' ') + '...'
    : review.text;
  
  const displayText = isExpanded ? review.text : truncatedText;
  const initial = review.author.charAt(0).toUpperCase();

  return (
    <Card className="w-full mb-4">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-lg">
            {initial}
          </div>

          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg m-0">{review.author}</h3>
              {review.location && (
                <span className="text-gray-500 text-sm">{review.location}</span>
              )}
            </div>

            {settings.enableRatings && (
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
            )}

            {settings.showDate && (
              <div className="text-sm text-gray-500 mb-2">
                {review.date}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600 leading-relaxed">
            {displayText}
          </p>

          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium focus:outline-none transition-colors"
            >
              {isExpanded ? textSettings.showLessText : textSettings.readMoreText}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

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
    phoneNumber: "604-357-4787",
    readMoreText: "Read more",
    showLessText: "Show less"
  },
  reviews: {
    maxDisplayLength: 300,
    reviewsPerPage: 5,
    enableRatings: true,
    showDate: true
  }
};

export default function SettingsPage() {
  const [statsForm] = Form.useForm();
  const [textForm] = Form.useForm();
  const [reviewSettingsForm] = Form.useForm();
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
        reviewSettingsForm.setFieldsValue(settings.reviews);
      } else {
        statsForm.setFieldsValue(defaultSettings.stats);
        textForm.setFieldsValue(defaultSettings.text);
        reviewSettingsForm.setFieldsValue(defaultSettings.reviews);
      }
    } catch (error) {
      message.error('Failed to load settings');
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formType: 'stats' | 'text' | 'reviews', values: any) => {
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

  const sampleReview: Review = {
    id: '1',
    author: 'Amy F',
    location: 'Vancouver, BC',
    date: 'November 2024',
    text: "I can't say enough good things about Unitus painting. When my grandmother needed her house painted and some minor repairs done in order to get the house ready for sale some years back, we looked into quite a few different companies for quotes. It was completely new territory for our family and was very daunting and overwhelming. Unitus not only had the most reasonable quote, they also sent a fantastic crew who got the job done beautifully and quickly. Bryce, the project manager, was also SO helpful and patient with all of our (many) questions along the way, and really gave us the impression that he genuinely cares about each client's individual needs. His knowledge and reassurance was invaluable to us during that time. So naturally when we needed some pretty extensive exterior painting work done on our own property it was Unitus we went with. Once again they exceeded our expectations and knocked it out of the park, getting the job done on time, on budget and while always being amazingly responsive to any questions we had during the job. We're extremely pleased with the quality of work that Unitus has consistently provided us, and will continue to use their services for as long as our house stands! I honestly cannot recommend them enough. Thanks Unitus team!",
    rating: 5
  };

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
                      {typeof value === 'string' && value.length > 50 ? (
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
            {
              key: 'reviews',
              label: (
                <span>
                  <CommentOutlined />
                  Review Settings
                </span>
              ),
              children: (
                <Form
                  form={reviewSettingsForm}
                  layout="vertical"
                  onFinish={(values) => handleSubmit('reviews', values)}
                  className="py-4"
                >
                  <Alert
                    message="Review Display Settings"
                    description="Configure how reviews are displayed on the website."
                    type="info"
                    showIcon
                    className="mb-6"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item
                      name="maxDisplayLength"
                      label="Maximum Review Length"
                      rules={[{ required: true, message: 'Please input maximum review length' }]}
                    >
                      <InputNumber min={100} step={50} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="reviewsPerPage"
                      label="Reviews Per Page"
                      rules={[{ required: true, message: 'Please input reviews per page' }]}
                    >
                      <InputNumber min={1} max={10} className="w-full" />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="enableRatings"
                    valuePropName="checked"
                    label="Show Ratings"
                  >
                    <Input type="checkbox" />
                  </Form.Item>

                  <Form.Item
                    name="showDate"
                    valuePropName="checked"
                    label="Show Review Date"
                  >
<Input type="checkbox" />
                  </Form.Item>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Preview</h3>
                    <ReviewCard 
                      review={sampleReview}
                      settings={reviewSettingsForm.getFieldsValue()}
                      textSettings={textForm.getFieldsValue()}
                    />
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={loading}
                      className="bg-blue-600 hover:bg-blue-500"
                    >
                      Save Review Settings
                    </Button>
                  </Form.Item>
                </Form>
              ),
            }
          ]}
        />
      </Card>
    </div>
  );
}