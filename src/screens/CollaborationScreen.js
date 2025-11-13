import CollaborationScreen from '../components/tamagui/CollaborationScreen';import React, { useState, useRef, useEffect } from 'react';

import {

export default CollaborationScreen;  View,

  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  FlatList,
  Modal,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Collaborator Card Component
const CollaboratorCard = ({ collaborator, onInvite }) => {
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
    <Animated.View
      style={[
        styles.collaboratorCard,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.collaboratorAvatar}>
        <MaterialCommunityIcons name="account" size={30} color="#6C63FF" />
        {collaborator.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.collaboratorInfo}>
        <Text style={styles.collaboratorName}>{collaborator.name}</Text>
        <Text style={styles.collaboratorRole}>{collaborator.role}</Text>
        <View style={styles.collaboratorSkills}>
          {collaborator.skills.map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={styles.inviteButton}
        onPress={() => onInvite(collaborator)}
      >
        <Ionicons name="person-add" size={20} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Project Card Component
const ProjectCard = ({ project, onPress }) => {
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
    <TouchableOpacity style={styles.projectCard} onPress={() => onPress(project)}>
      <LinearGradient
        colors={project.colors || ['#6C63FF', '#4ECDC4']}
        style={styles.projectGradient}
      >
        <View style={styles.projectHeader}>
          <MaterialCommunityIcons name={project.icon} size={40} color="#fff" />
          <View style={styles.projectStatus}>
            <Text style={styles.projectStatusText}>{project.status}</Text>
          </View>
        </View>
        <Text style={styles.projectTitle}>{project.title}</Text>
        <Text style={styles.projectDescription}>{project.description}</Text>
        
        <View style={styles.projectMembers}>
          {project.members.slice(0, 3).map((member, index) => (
            <View key={index} style={[styles.memberAvatar, { marginLeft: index * -10 }]}>
              <MaterialCommunityIcons name="account" size={20} color="#fff" />
            </View>
          ))}
          {project.members.length > 3 && (
            <Text style={styles.moreMembersText}>+{project.members.length - 3}</Text>
          )}
        </View>
        
        <View style={styles.projectProgress}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth }]}
            />
          </View>
          <Text style={styles.progressText}>{project.progress}%</Text>
        </View>
        
        <View style={styles.projectFooter}>
          <View style={styles.projectStat}>
            <Ionicons name="chatbubbles" size={16} color="#fff" />
            <Text style={styles.projectStatText}>{project.messages}</Text>
          </View>
          <View style={styles.projectStat}>
            <Ionicons name="document" size={16} color="#fff" />
            <Text style={styles.projectStatText}>{project.files}</Text>
          </View>
          <View style={styles.projectStat}>
            <Ionicons name="calendar" size={16} color="#fff" />
            <Text style={styles.projectStatText}>{project.deadline}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Activity Item Component
const ActivityItem = ({ activity }) => {
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
    <Animated.View
      style={[
        styles.activityItem,
        {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
        <MaterialCommunityIcons name={activity.icon} size={20} color={activity.color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>{activity.text}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
    </Animated.View>
  );
};

const CollaborationScreen = ({ navigation }) => {
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

  const handleProjectPress = (project) => {
    // Navigate to project details
  };

  const handleInviteCollaborator = (collaborator) => {
    setShowInviteModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Collaboration Hub</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications" size={24} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'projects' && styles.activeTab]}
          onPress={() => setActiveTab('projects')}
        >
          <Text style={[styles.tabText, activeTab === 'projects' && styles.activeTabText]}>
            Projects
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'team' && styles.activeTab]}
          onPress={() => setActiveTab('team')}
        >
          <Text style={[styles.tabText, activeTab === 'team' && styles.activeTabText]}>
            Team
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activity' && styles.activeTab]}
          onPress={() => setActiveTab('activity')}
        >
          <Text style={[styles.tabText, activeTab === 'activity' && styles.activeTabText]}>
            Activity
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'projects' && (
          <View style={styles.projectsContainer}>
            <TouchableOpacity
              style={styles.createProjectButton}
              onPress={() => setShowCreateModal(true)}
            >
              <LinearGradient
                colors={['#6C63FF', '#4ECDC4']}
                style={styles.createProjectGradient}
              >
                <Ionicons name="add-circle" size={40} color="#fff" />
                <Text style={styles.createProjectText}>Create New Project</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPress={handleProjectPress}
              />
            ))}
          </View>
        )}

        {activeTab === 'team' && (
          <View style={styles.teamContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#888" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search collaborators..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <Text style={styles.sectionTitle}>Suggested Collaborators</Text>
            {collaborators.map((collaborator) => (
              <CollaboratorCard
                key={collaborator.id}
                collaborator={collaborator}
                onInvite={handleInviteCollaborator}
              />
            ))}
          </View>
        )}

        {activeTab === 'activity' && (
          <View style={styles.activityContainer}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {activities.map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create Project Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Project</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Project Name"
              placeholderTextColor="#666"
            />
            
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Project Description"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <LinearGradient
                  colors={['#6C63FF', '#4ECDC4']}
                  style={styles.createButtonGradient}
                >
                  <Text style={styles.modalButtonText}>Create</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A1A2E',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B6B',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: '#1A1A2E',
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6C63FF',
  },
  tabText: {
    color: '#888',
    fontSize: 14,
  },
  activeTabText: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  projectsContainer: {
    padding: 20,
  },
  createProjectButton: {
    marginBottom: 20,
  },
  createProjectGradient: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  createProjectText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  projectCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  projectGradient: {
    padding: 20,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  projectStatus: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  projectStatusText: {
    color: '#fff',
    fontSize: 12,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  projectDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
  },
  projectMembers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  memberAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  moreMembersText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 12,
  },
  projectProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectStatText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
  },
  teamContainer: {
    padding: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  collaboratorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  collaboratorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ECDC4',
    borderWidth: 2,
    borderColor: '#1A1A2E',
  },
  collaboratorInfo: {
    flex: 1,
  },
  collaboratorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  collaboratorRole: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  collaboratorSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 5,
    marginTop: 5,
  },
  skillText: {
    color: '#6C63FF',
    fontSize: 10,
  },
  inviteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContainer: {
    padding: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 12,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#2A2A3E',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  modalTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#2A2A3E',
    marginRight: 10,
  },
  createButton: {
    overflow: 'hidden',
  },
  createButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CollaborationScreen;
