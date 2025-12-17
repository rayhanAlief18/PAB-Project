import FormDatePicker from '@/components/custom/Form/FormDatePicker';
import FormInput from '@/components/custom/Form/FormInput';
import FormPriorityPicker, { TaskPriority } from '@/components/custom/Form/FormPriorityPicker';
import FormTextArea from '@/components/custom/Form/FormTextArea';
import FormTimePicker from '@/components/custom/Form/FormTimePicker';
import HeaderPage from '@/components/custom/HeaderPage';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { useTasks } from '@/contexts/TaskContext';
import { router, useLocalSearchParams } from 'expo-router';
import { Calendar, Clock } from 'lucide-react-native';
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
  const [deadline, setDeadline] = useState<Date | null>(null);
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
        setDeadline(task.deadline);
        setPriority(task.priority);
      }
    }
  }, [isEditMode, params.id, tasks]);

  const handleSave = () => {
    if (!title || !description || !startTime || !endTime || !deadline) {
      // TODO: Show validation error
      return;
    }

    const taskData = {
      title,
      description,
      startTime,
      endTime,
      deadline,
      status: (isEditMode ? tasks.find(t => t.id === params.id)?.status : 'On Progress') as 'On Progress' | 'Done',
      priority,
      progress: isEditMode ? (tasks.find(t => t.id === params.id)?.progress || 0) : 0,
    };

    // Console log untuk melihat data yang dibuat/diupdate
    console.log('=== Task Data ===');
    console.log('Mode:', isEditMode ? 'Edit' : 'Create');
    console.log('Task Data:', {
      title: taskData.title,
      description: taskData.description,
      startTime: taskData.startTime?.toISOString() || null,
      endTime: taskData.endTime?.toISOString() || null,
      deadline: taskData.deadline?.toISOString() || null,
      status: taskData.status,
      priority: taskData.priority,
      progress: taskData.progress,
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
      <HeaderPage title='Create Task' />
      <ScrollView className='flex-1'>
        <VStack className='px-[30px] mt-[60px] gap-5'>

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

            {/* Deadline Input - Menggunakan Date Picker */}
            <FormDatePicker
              label="Deadline"
              icon={Calendar}
              value={deadline}
              onChange={setDeadline}
              placeholder='Pilih tanggal deadline'
              minimumDate={new Date()}
            />

            {/* Priority Picker */}
            <FormPriorityPicker
              label="Tingkat Prioritas"
              value={priority}
              onChange={setPriority}
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
