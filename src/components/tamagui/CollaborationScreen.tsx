import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import { Stack, Text as TamaguiText } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Collaborator Card Component
const CollaboratorCard = ({ collaborator, onInvite }: any) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Stack
        flexDirection="row"
        alignItems="center"
        backgroundColor="#1A1A2E"
        padding={15}
        borderRadius={15}
        marginBottom={15}
      >
        <Stack
          width={50}
          height={50}
          borderRadius={25}
          backgroundColor="rgba(108, 99, 255, 0.2)"
          justifyContent="center"
          alignItems="center"
          marginRight={15}
          position="relative"
        >
          <MaterialCommunityIcons name="account" size={30} color="#6C63FF" />
          {collaborator.isOnline && (
            <Stack
              position="absolute"
              bottom={0}
              right={0}
              width={12}
              height={12}
              borderRadius={6}
              backgroundColor="#4ECDC4"
              borderWidth={2}
              borderColor="#1A1A2E"
            />
          )}
        </Stack>
        <Stack flex={1}>
          <TamaguiText fontSize={16} fontWeight="bold" color="#fff">
            {collaborator.name}
          </TamaguiText>
          <TamaguiText fontSize={12} color="#888" marginBottom={5}>
            {collaborator.role}
          </TamaguiText>
          <Stack flexDirection="row" flexWrap="wrap">
            {collaborator.skills.map((skill: string, index: number) => (
              <Stack
                key={index}
                backgroundColor="rgba(108, 99, 255, 0.2)"
                paddingHorizontal={8}
                paddingVertical={3}
                borderRadius={10}
                marginRight={5}
                marginTop={5}
              >
                <TamaguiText color="#6C63FF" fontSize={10}>{skill}</TamaguiText>
              </Stack>
            ))}
          </Stack>
        </Stack>
        <TouchableOpacity
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => onInvite(collaborator)}
        >
          <Ionicons name="person-add" size={20} color="#fff" />
        </TouchableOpacity>
      </Stack>
    </Animated.View>
  );
};

// Project Card Component
const ProjectCard = ({ project, onPress }: any) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: project.progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [project.progress]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity style={{ marginBottom: 20, borderRadius: 20, overflow: 'hidden' }} onPress={() => onPress(project)}>
      <LinearGradient colors={project.colors || ['#6C63FF', '#4ECDC4']} style={{ padding: 20 }}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={15}>
          <MaterialCommunityIcons name={project.icon} size={40} color="#fff" />
          <Stack backgroundColor="rgba(255,255,255,0.2)" paddingHorizontal={10} paddingVertical={5} borderRadius={10}>
            <TamaguiText color="#fff" fontSize={12}>{project.status}</TamaguiText>
          </Stack>
        </Stack>
        <TamaguiText fontSize={20} fontWeight="bold" color="#fff" marginBottom={5}>
          {project.title}
        </TamaguiText>
        <TamaguiText fontSize={14} color="rgba(255,255,255,0.8)" marginBottom={15}>
          {project.description}
        </TamaguiText>
        
        <Stack flexDirection="row" alignItems="center" marginBottom={15}>
          {project.members.slice(0, 3).map((member: string, index: number) => (
            <Stack
              key={index}
              width={30}
              height={30}
              borderRadius={15}
              backgroundColor="rgba(255,255,255,0.2)"
              justifyContent="center"
              alignItems="center"
              borderWidth={2}
              borderColor="#fff"
              marginLeft={index === 0 ? 0 : -10}
            >
              <MaterialCommunityIcons name="account" size={20} color="#fff" />
            </Stack>
          ))}
          {project.members.length > 3 && (
            <TamaguiText color="#fff" marginLeft={10} fontSize={12}>
              +{project.members.length - 3}
            </TamaguiText>
          )}
        </Stack>
        
        <Stack flexDirection="row" alignItems="center" marginBottom={15}>
          <Stack flex={1} height={6} backgroundColor="rgba(255,255,255,0.2)" borderRadius={3} marginRight={10} overflow="hidden">
            <Animated.View style={{ height: '100%', width: progressWidth, backgroundColor: '#fff', borderRadius: 3 }} />
          </Stack>
          <TamaguiText color="#fff" fontSize={12}>{project.progress}%</TamaguiText>
        </Stack>
        
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack flexDirection="row" alignItems="center">
            <Ionicons name="chatbubbles" size={16} color="#fff" />
            <TamaguiText color="#fff" fontSize={12} marginLeft={5}>{project.messages}</TamaguiText>
          </Stack>
          <Stack flexDirection="row" alignItems="center">
            <Ionicons name="document" size={16} color="#fff" />
            <TamaguiText color="#fff" fontSize={12} marginLeft={5}>{project.files}</TamaguiText>
          </Stack>
          <Stack flexDirection="row" alignItems="center">
            <Ionicons name="calendar" size={16} color="#fff" />
            <TamaguiText color="#fff" fontSize={12} marginLeft={5}>{project.deadline}</TamaguiText>
          </Stack>
        </Stack>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Activity Item Component
const ActivityItem = ({ activity }: any) => {
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateX: slideAnim }], opacity: fadeAnim }}>
      <Stack
        flexDirection="row"
        alignItems="center"
        backgroundColor="#1A1A2E"
        padding={15}
        borderRadius={15}
        marginBottom={15}
      >
        <Stack
          width={40}
          height={40}
          borderRadius={20}
          justifyContent="center"
          alignItems="center"
          marginRight={15}
          backgroundColor={activity.color + '20'}
        >
          <MaterialCommunityIcons name={activity.icon} size={20} color={activity.color} />
        </Stack>
        <Stack flex={1}>
          <TamaguiText fontSize={14} color="#fff" marginBottom={3}>
            {activity.text}
          </TamaguiText>
          <TamaguiText fontSize={12} color="#888">{activity.time}</TamaguiText>
        </Stack>
      </Stack>
    </Animated.View>
  );
};

const CollaborationScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const projects = [
    {
      id: '1',
      title: 'Summer Collection 2024',
      description: 'Beachwear and casual summer designs',
      icon: 'weather-sunny',
      colors: ['#FFD93D', '#FF6B6B'],
      status: 'Active',
      progress: 75,
      members: ['Alice', 'Bob', 'Carol', 'David'],
      messages: 45,
      files: 12,
      deadline: 'Mar 15',
    },
    {
      id: '2',
      title: 'Urban Street Fashion',
      description: 'Modern streetwear collection',
      icon: 'city',
      colors: ['#6C63FF', '#4ECDC4'],
      status: 'In Review',
      progress: 90,
      members: ['Eve', 'Frank'],
      messages: 23,
      files: 8,
      deadline: 'Mar 10',
    },
    {
      id: '3',
      title: 'Eco-Friendly Line',
      description: 'Sustainable fashion designs',
      icon: 'leaf',
      colors: ['#4ECDC4', '#A8E6CF'],
      status: 'Planning',
      progress: 30,
      members: ['Grace', 'Henry', 'Iris'],
      messages: 15,
      files: 5,
      deadline: 'Apr 1',
    },
  ];

  const collaborators = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Fashion Designer',
      skills: ['Sketching', '3D Design', 'Patterns'],
      isOnline: true,
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Mike Chen',
      role: 'Textile Expert',
      skills: ['Fabrics', 'Sustainability', 'Sourcing'],
      isOnline: false,
      rating: 4.9,
    },
    {
      id: '3',
      name: 'Emma Wilson',
      role: 'Color Specialist',
      skills: ['Color Theory', 'Trends', 'Palettes'],
      isOnline: true,
      rating: 4.7,
    },
  ];

  const activities = [
    {
      icon: 'comment',
      text: 'Sarah commented on Summer Collection',
      time: '2 mins ago',
      color: '#6C63FF',
    },
    {
      icon: 'upload',
      text: 'Mike uploaded new fabric samples',
      time: '15 mins ago',
      color: '#4ECDC4',
    },
    {
      icon: 'check-circle',
      text: 'Design review completed',
      time: '1 hour ago',
      color: '#4ECDC4',
    },
    {
      icon: 'account-plus',
      text: 'Emma joined the team',
      time: '3 hours ago',
      color: '#FFD93D',
    },
  ];

  const handleProjectPress = (project: any) => {
    // Navigate to project details
  };

  const handleInviteCollaborator = (collaborator: any) => {
    setShowInviteModal(true);
  };

  return (
    <Stack flex={1} backgroundColor="#0F0F1E">
      {/* Header */}
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={20}
        paddingVertical={15}
        backgroundColor="#1A1A2E"
      >
        <TamaguiText fontSize={24} fontWeight="bold" color="#fff">
          Collaboration Hub
        </TamaguiText>
        <Stack flexDirection="row">
          <TouchableOpacity style={{ marginLeft: 15, position: 'relative' }}>
            <Ionicons name="notifications" size={24} color="#fff" />
            <Stack
              position="absolute"
              top={-5}
              right={-5}
              backgroundColor="#FF6B6B"
              width={18}
              height={18}
              borderRadius={9}
              justifyContent="center"
              alignItems="center"
            >
              <TamaguiText color="#fff" fontSize={10} fontWeight="bold">3</TamaguiText>
            </Stack>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </Stack>
      </Stack>

      {/* Tabs */}
      <Stack flexDirection="row" paddingHorizontal={20} backgroundColor="#1A1A2E" paddingBottom={10}>
        <TouchableOpacity
          style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === 'projects' ? '#6C63FF' : 'transparent' }}
          onPress={() => setActiveTab('projects')}
        >
          <TamaguiText color={activeTab === 'projects' ? '#6C63FF' : '#888'} fontSize={14} fontWeight={activeTab === 'projects' ? 'bold' : 'normal'}>
            Projects
          </TamaguiText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === 'team' ? '#6C63FF' : 'transparent' }}
          onPress={() => setActiveTab('team')}
        >
          <TamaguiText color={activeTab === 'team' ? '#6C63FF' : '#888'} fontSize={14} fontWeight={activeTab === 'team' ? 'bold' : 'normal'}>
            Team
          </TamaguiText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === 'activity' ? '#6C63FF' : 'transparent' }}
          onPress={() => setActiveTab('activity')}
        >
          <TamaguiText color={activeTab === 'activity' ? '#6C63FF' : '#888'} fontSize={14} fontWeight={activeTab === 'activity' ? 'bold' : 'normal'}>
            Activity
          </TamaguiText>
        </TouchableOpacity>
      </Stack>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'projects' && (
          <Stack padding={20}>
            <TouchableOpacity style={{ marginBottom: 20 }} onPress={() => setShowCreateModal(true)}>
              <LinearGradient colors={['#6C63FF', '#4ECDC4']} style={{ padding: 30, borderRadius: 20, alignItems: 'center' }}>
                <Ionicons name="add-circle" size={40} color="#fff" />
                <TamaguiText color="#fff" fontSize={18} fontWeight="bold" marginTop={10}>
                  Create New Project
                </TamaguiText>
              </LinearGradient>
            </TouchableOpacity>
            
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onPress={handleProjectPress} />
            ))}
          </Stack>
        )}

        {activeTab === 'team' && (
          <Stack padding={20}>
            <Stack
              flexDirection="row"
              alignItems="center"
              backgroundColor="#1A1A2E"
              borderRadius={25}
              paddingHorizontal={15}
              paddingVertical={12}
              marginBottom={20}
            >
              <Ionicons name="search" size={20} color="#888" />
              <TextInput
                style={{ flex: 1, color: '#fff', marginLeft: 10, fontSize: 14 }}
                placeholder="Search collaborators..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Stack>
            
            <TamaguiText fontSize={18} fontWeight="bold" color="#fff" marginBottom={15}>
              Suggested Collaborators
            </TamaguiText>
            {collaborators.map((collaborator) => (
              <CollaboratorCard
                key={collaborator.id}
                collaborator={collaborator}
                onInvite={handleInviteCollaborator}
              />
            ))}
          </Stack>
        )}

        {activeTab === 'activity' && (
          <Stack padding={20}>
            <TamaguiText fontSize={18} fontWeight="bold" color="#fff" marginBottom={15}>
              Recent Activity
            </TamaguiText>
            {activities.map((activity, index) => (
              <ActivityItem key={`activity-${index}`} activity={activity} />
            ))}
          </Stack>
        )}
      </ScrollView>

      {/* Create Project Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <BlurView intensity={100} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Stack backgroundColor="#1A1A2E" borderRadius={20} padding={20} width={width * 0.9}>
            <TamaguiText fontSize={24} fontWeight="bold" color="#fff" marginBottom={20} textAlign="center">
              Create New Project
            </TamaguiText>
            
            <TextInput
              style={{ backgroundColor: '#2A2A3E', color: '#fff', padding: 15, borderRadius: 10, fontSize: 16, marginBottom: 15 }}
              placeholder="Project Name"
              placeholderTextColor="#666"
            />
            
            <TextInput
              style={{ backgroundColor: '#2A2A3E', color: '#fff', padding: 15, borderRadius: 10, fontSize: 16, marginBottom: 15, height: 100, textAlignVertical: 'top' }}
              placeholder="Project Description"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
            />
            
            <Stack flexDirection="row" justifyContent="space-between" marginTop={20}>
              <TouchableOpacity
                style={{ flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', backgroundColor: '#2A2A3E', marginRight: 10 }}
                onPress={() => setShowCreateModal(false)}
              >
                <TamaguiText color="#fff" fontSize={16} fontWeight="bold">Cancel</TamaguiText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, borderRadius: 10, overflow: 'hidden' }}
                onPress={() => setShowCreateModal(false)}
              >
                <LinearGradient colors={['#6C63FF', '#4ECDC4']} style={{ paddingVertical: 12, alignItems: 'center' }}>
                  <TamaguiText color="#fff" fontSize={16} fontWeight="bold">Create</TamaguiText>
                </LinearGradient>
              </TouchableOpacity>
            </Stack>
          </Stack>
        </BlurView>
      </Modal>
    </Stack>
  );
};

export default CollaborationScreen;
