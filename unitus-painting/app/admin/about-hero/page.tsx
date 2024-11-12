"use client";

import { useState, useEffect } from "react";
import { Form, Card, message } from "antd";
import { AboutHeroContent } from "@/types/AboutHero";
import { Input, Switch } from "antd";

export default function AboutHeroCMS() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/about-hero");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        form.setFieldsValue(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form]);

  const onFinish = async (values: AboutHeroContent) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/about-hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to update");
      
      const data = await response.json();
      
      if (data.success) {
        message.success("Content updated successfully");
        // Refresh the form with the new values
        form.setFieldsValue(values);
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      message.error("Failed to update content");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <Card title="About Hero Section">
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="space-y-6"
          disabled={loading}
          onFinishFailed={(errorInfo) => {
            message.error("Please fill in all required fields");
          }}
        >
          {/* Main Heading Line 1 */}
          <Form.Item
            label="Main Heading Line 1"
            name={["mainHeading", "line1"]}
            rules={[{ required: true, message: "Please enter the first line" }]}
          >
            <Input placeholder="Enter first line of heading" />
          </Form.Item>

          {/* Main Heading Line 2 */}
          <Form.Item
            label="Main Heading Line 2"
            name={["mainHeading", "line2"]}
            rules={[{ required: true, message: "Please enter the second line" }]}
          >
            <Input placeholder="Enter second line of heading" />
          </Form.Item>

          {/* Description */}
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter section description"
            />
          </Form.Item>

          {/* Video URL */}
          <Form.Item
            label="Video URL"
            name="videoUrl"
            rules={[{ required: true, message: "Please enter the video URL" }]}
          >
            <Input placeholder="Enter video URL" />
          </Form.Item>

          {/* Mobile Background Toggle */}
          <Form.Item
            label="Enable Mobile Background"
            name="isMobileEnabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors
                  ${submitting ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}