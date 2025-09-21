'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { JobDescription } from '@/lib/types';
import { UploadCloud } from 'lucide-react';

const formSchema = z.object({
  role: z.string().min(2, 'Job role must be at least 2 characters.'),
  location: z.string().min(1, 'Please select a location.'),
  text: z.string().min(50, 'Job description must be at least 50 characters.'),
});

type JdUploadTabProps = {
  onJdUpload: (jd: Omit<JobDescription, 'id'>) => void;
};

export default function JdUploadTab({ onJdUpload }: JdUploadTabProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
      location: '',
      text: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onJdUpload(values);
    form.reset();
  }

  return (
    <Card className="mt-4 border-dashed border-2 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="text-primary" />
          Upload New Job Description
        </CardTitle>
        <CardDescription>
          Fill in the details and paste the job description to start analyzing
          resumes against it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Python Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Pune">Pune</SelectItem>
                        <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the full job description here..."
                      className="min-h-[200px] text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              <UploadCloud className="mr-2 h-4 w-4" />
              Add Job Description
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
