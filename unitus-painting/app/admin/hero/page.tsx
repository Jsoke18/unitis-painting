'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { notification } from 'antd';
import { HeroContent, defaultHeroContent } from '../../types/Hero';
import { useRouter } from 'next/navigation';
import { NotificationPlacement } from 'antd/es/notification/interface';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const HeroAdmin = () => {
  const router = useRouter();
  const [content, setContent] = useState<HeroContent>(defaultHeroContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    type: NotificationType,
    message: string,
    description: string,
    placement: NotificationPlacement = 'topRight'
  ) => {
    api[type]({
      message,
      description,
      placement,
      duration: type === 'error' ? 0 : 4.5,
      style: {
        borderRadius: '8px',
        padding: '12px',
      },
      className: 'custom-ant-notification',
    });
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hero');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setContent(data);
      openNotification(
        'success',
        'Content Loaded',
        'Hero section content has been loaded successfully.',
      );
    } catch (error) {
      console.error('Error fetching content:', error);
      openNotification(
        'error',
        'Failed to Load Content',
        'There was an error loading the hero section content. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update content');
      }
      
      setHasChanges(false);
      router.refresh();
      
      // Show success notification with Ant Design
      openNotification(
        'success',
        'Changes Saved Successfully',
        'Your changes to the hero section have been saved and published.',
      );
    } catch (error) {
      console.error('Error saving content:', error);
      // Show error notification with Ant Design
      openNotification(
        'error',
        'Failed to Save Changes',
        error instanceof Error ? error.message : 'Please try again or contact support if the issue persists.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResetConfirm = () => {
    if (hasChanges) {
      // Show warning notification with confirm button
      notification.warn({
        message: 'Reset Changes?',
        description: 'Are you sure you want to reset all changes? This cannot be undone.',
        placement: 'topRight',
        duration: 0,
        btn: (
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => notification.destroy()}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              size="sm"
              onClick={() => {
                fetchContent();
                notification.destroy();
              }}
            >
              Reset
            </Button>
          </div>
        ),
      });
    } else {
      fetchContent();
    }
  };

  const handleChange = (path: string, value: string) => {
    setContent(prev => {
      const newContent = { ...prev };
      const parts = path.split('.');
      let current = newContent as any;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return newContent;
    });
    setHasChanges(true);
  };

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Edit Hero Section Content</CardTitle>
            {hasChanges && (
              <span className="text-sm text-muted-foreground">
                Unsaved changes
              </span>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ... (rest of the form fields remain the same) ... */}
            
            <div className="flex items-center justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={handleResetConfirm}
                disabled={saving}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving || !hasChanges}
                className="min-w-[140px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default HeroAdmin;