import { Header } from '@/components/custom';
import FormInput from '@/components/custom/Form/FormInput';
import FormPriorityPicker, { TaskPriority } from '@/components/custom/Form/FormPriorityPicker';
import FormStatusPicker, { TaskStatus } from '@/components/custom/Form/FormStatusPicker';
import FormTextArea from '@/components/custom/Form/FormTextArea';
import FormTimePicker from '@/components/custom/Form/FormTimePicker';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { useTasks } from '@/contexts/TaskContext';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateTaskScreen() {
  const { addTask, updateTask, tasks } = useTasks();
  const params = useLocalSearchParams();
  const isEditMode = !!params.id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [status, setStatus] = useState<TaskStatus>('On Progress');
  const [priority, setPriority] = useState<TaskPriority>('Medium');

  // Load task data if editing
  useEffect(() => {
    if (isEditMode && params.id) {
      const task = tasks.find(t => t.id === params.id);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setStartTime(task.startTime);
        setEndTime(task.endTime);
        setStatus(task.status);
        setPriority(task.priority);
      }
    }
  }, [isEditMode, params.id, tasks]);

  const handleSave = () => {
    if (!title || !description || !startTime || !endTime) {
      // TODO: Show validation error
      return;
    }

    const taskData = {
      title,
      description,
      startTime,
      endTime,
      deadline: endTime,     // atau Date lain
      status,
      priority,
      progress: 0,
    };

    // Console log untuk melihat data yang dibuat/diupdate
    console.log('=== Task Data ===');
    console.log('Mode:', isEditMode ? 'Edit' : 'Create');
    console.log('Task Data:', {
      title: taskData.title,
      description: taskData.description,
      startTime: taskData.startTime?.toISOString() || null,
      endTime: taskData.endTime?.toISOString() || null,
      status: taskData.status,
      priority: taskData.priority,
    });
    console.log('================');

    if (isEditMode && params.id) {
      const existingTask = tasks.find(t => t.id === params.id);
      updateTask(params.id as string, taskData);
      console.log('Task updated successfully');
    } else {
      addTask(taskData);
      console.log('Task created successfully');
    }
    router.back();
  };

  return (
    <SafeAreaView className='flex-1 bg-[#F2F2F7]'>
      <Header name='Azhim' customClass='px-[30px]' />
      <ScrollView className='flex-1'>
        <VStack className='px-[30px] py-[20px] gap-5'>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} className='mb-2'>
            <HStack className='items-center gap-2'>
              <ArrowLeft size={24} color='#4B4B4B' />
              <Text className='text-[16px]' style={{ fontFamily: "HankenGrotesk_500Medium" }}>
                Kembali
              </Text>
            </HStack>
          </TouchableOpacity>

          {/* Title */}
          <Text className='text-[24px] tracking-[-1.1px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>
            {isEditMode ? 'Edit Task' : 'Buat Task Baru'}
          </Text>

          {/* Form */}
          <VStack className='gap-4'>
            {/* Title Input - Menggunakan komponen dengan props */}
            <FormInput
              label="Judul Task"
              value={title}
              onChangeText={setTitle}
              placeholder='Masukkan judul task'
            />

            {/* Description Input - Menggunakan komponen dengan props */}
            <FormTextArea
              label="Deskripsi"
              value={description}
              onChangeText={setDescription}
              placeholder='Masukkan deskripsi task'
              rows={4}
            />

            {/* Time Input - Menggunakan Time Picker */}
            <HStack className='gap-3'>
              <FormTimePicker
                label="Waktu Mulai"
                icon={Clock}
                value={startTime}
                onChange={setStartTime}
                placeholder='Pilih waktu mulai'
                containerClassName='flex-1'
              />

              <FormTimePicker
                label="Waktu Selesai"
                icon={Clock}
                value={endTime}
                onChange={setEndTime}
                placeholder='Pilih waktu selesai'
                containerClassName='flex-1'
              />
            </HStack>

            {/* Priority Picker */}
            <FormPriorityPicker
              label="Tingkat Prioritas"
              value={priority}
              onChange={setPriority}
            />

            {/* Status Picker */}
            <FormStatusPicker
              label="Status"
              value={status}
              onChange={setStatus}
            />
          </VStack>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className='bg-black rounded-[8px] py-4 mt-4 mb-8'
            activeOpacity={0.8}
          >
            <Text
              className='text-white text-center text-[16px]'
              style={{ fontFamily: "HankenGrotesk_700Bold" }}
            >
              {isEditMode ? 'Update Task' : 'Simpan Task'}
            </Text>
          </TouchableOpacity>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}