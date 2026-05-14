import { Stack } from 'expo-router';
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { useThemePalette } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { db } from '@/services/firebase';

interface StudentProfileData {
  name: string;
  course: string;
  university: string;
  yearOfStudy: string;
  skills: string[];
  bio: string;
  availability: string;
  portfolioItems: any[];
  profileImageUrl: string;
  rating: number;
  totalRatings: number;
  totalEarned: number;
  isVerified: boolean;
  followers?: string[];
  following?: string[];
}

function isDemoUser(user: any) {
  return user?.uid === 'demo-google-user' || user?.email === 'libby@gigvarsity.app';
}

function getDemoProfileData(user: any): StudentProfileData {
  return {
    name: user?.displayName || 'Libby',
    course: 'Mass Communication',
    university: 'University of Lagos',
    yearOfStudy: '400 Level',
    skills: ['Writing', 'SEO', 'Content Strategy'],
    bio: 'Student creator building a strong portfolio through paid gigs and freelance work.',
    availability: 'Available weekends and weekday evenings',
    portfolioItems: [
      { title: 'Campus Magazine Feature', description: '', fileUrl: 'https://via.placeholder.com/200x120', type: 'image' },
      { title: 'SEO Blog Samples', description: '', fileUrl: 'https://via.placeholder.com/200x120', type: 'image' },
    ],
    profileImageUrl: '',
    rating: 4.8,
    totalRatings: 12,
    totalEarned: 165000,
    isVerified: true,
    followers: ['follower-demo-1', 'follower-demo-2', 'follower-demo-3'],
    following: ['company-demo-1', 'company-demo-2'],
  };
}

export default function StudentProfile() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const user = useAuthStore((state) => state.user);
  const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [skillsModalVisible, setSkillsModalVisible] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [portfolioModalVisible, setPortfolioModalVisible] = useState(false);
  const [newPortfolioUrl, setNewPortfolioUrl] = useState('');
  const [followModalVisible, setFollowModalVisible] = useState(false);
  const [followList, setFollowList] = useState<Array<{ uid: string; name: string; role: string; profileImageUrl?: string }>>([]);
  const [followMode, setFollowMode] = useState<'followers' | 'following'>('followers');
  const [followLoading, setFollowLoading] = useState(false);
  const demoMode = isDemoUser(user);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !db) {
        setLoading(false);
        return;
      }

      if (isDemoUser(user)) {
        setProfileData(getDemoProfileData(user));
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setProfileData(userDoc.data() as StudentProfileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfileData(getDemoProfileData(user));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Open edit modal for a field
  const openEditModal = (field: string, value: string) => {
    setEditField(field);
    setEditValue(value);
    setEditModalVisible(true);
  };

  // Save field changes to Firestore
  const saveFieldChange = async () => {
    if (!user || !db || !editField || editValue === undefined) return;

    if (demoMode) {
      setProfileData((prev) =>
        prev ? { ...prev, [editField]: editValue } : prev
      );
      setEditModalVisible(false);
      setEditField(null);
      setEditValue('');
      return;
    }

    setSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        [editField]: editValue,
      });

      // Update local state
      setProfileData((prev) =>
        prev ? { ...prev, [editField]: editValue } : null
      );

      setEditModalVisible(false);
      setEditField(null);
      setEditValue('');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const loadFollowList = async (mode: 'followers' | 'following') => {
    if (!user || !db || !profileData) return;
    const firestore = db;

    setFollowLoading(true);
    setFollowMode(mode);
    setFollowList([]);
    setFollowModalVisible(true);

    if (demoMode) {
      const demoRecords =
        mode === 'followers'
          ? [
              { uid: 'follower-demo-1', name: 'Amaka James', role: 'student' },
              { uid: 'follower-demo-2', name: 'Kehinde Works', role: 'company' },
              { uid: 'follower-demo-3', name: 'Tobi Design', role: 'student' },
            ]
          : [
              { uid: 'company-demo-1', name: 'NairaTech', role: 'company' },
              { uid: 'company-demo-2', name: 'EduContent', role: 'company' },
            ];
      setFollowList(demoRecords);
      setFollowLoading(false);
      return;
    }

    const ids = mode === 'followers' ? profileData.followers || [] : profileData.following || [];

    try {
      const records = await Promise.all(
        ids.map(async (uid) => {
          const userDoc = await getDoc(doc(firestore, 'users', uid));
          if (!userDoc.exists()) {
            return { uid, name: 'Unknown', role: 'Unknown', profileImageUrl: '' };
          }
          const data = userDoc.data() as any;
          return {
            uid,
            name: data.name || data.email?.split('@')[0] || 'Unknown',
            role: data.role || 'Unknown',
            profileImageUrl: data.profileImageUrl || '',
          };
        })
      );
      setFollowList(records);
    } catch (error) {
      console.error('Error loading follow list:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  // Add new skill
  const addSkill = async () => {
    if (!user || !db || !newSkill.trim()) return;

    if (demoMode) {
      const updatedSkills = [...(profileData?.skills || []), newSkill.trim()];
      setProfileData((prev) =>
        prev ? { ...prev, skills: updatedSkills } : prev
      );
      setNewSkill('');
      setSkillsModalVisible(false);
      return;
    }

    setSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedSkills = [...(profileData?.skills || []), newSkill.trim()];
      await updateDoc(userDocRef, {
        skills: updatedSkills,
      });

      setProfileData((prev) =>
        prev ? { ...prev, skills: updatedSkills } : null
      );

      setNewSkill('');
      setSkillsModalVisible(false);
    } catch (error) {
      console.error('Error adding skill:', error);
    } finally {
      setSaving(false);
    }
  };

  // Remove skill
  const removeSkill = async (skillToRemove: string) => {
    if (!user || !db) return;

    if (demoMode) {
      const updatedSkills = (profileData?.skills || []).filter(
        (skill) => skill !== skillToRemove
      );
      setProfileData((prev) =>
        prev ? { ...prev, skills: updatedSkills } : prev
      );
      return;
    }

    setSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedSkills = (profileData?.skills || []).filter(
        (skill) => skill !== skillToRemove
      );
      await updateDoc(userDocRef, {
        skills: updatedSkills,
      });

      setProfileData((prev) =>
        prev ? { ...prev, skills: updatedSkills } : null
      );
    } catch (error) {
      console.error('Error removing skill:', error);
    } finally {
      setSaving(false);
    }
  };

  // Add portfolio item
  const addPortfolioItem = async () => {
    if (!user || !db || !newPortfolioUrl.trim()) return;

    if (demoMode) {
      const newItem = {
        title: `Portfolio Item ${(profileData?.portfolioItems?.length || 0) + 1}`,
        description: '',
        fileUrl: newPortfolioUrl.trim(),
        type: 'image',
      };
      const updatedPortfolio = [...(profileData?.portfolioItems || []), newItem];
      setProfileData((prev) =>
        prev ? { ...prev, portfolioItems: updatedPortfolio } : prev
      );
      setNewPortfolioUrl('');
      setPortfolioModalVisible(false);
      return;
    }

    setSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const newItem = {
        title: `Portfolio Item ${(profileData?.portfolioItems?.length || 0) + 1}`,
        description: '',
        fileUrl: newPortfolioUrl.trim(),
        type: 'image',
      };
      const updatedPortfolio = [...(profileData?.portfolioItems || []), newItem];
      await updateDoc(userDocRef, {
        portfolioItems: updatedPortfolio,
      });

      setProfileData((prev) =>
        prev ? { ...prev, portfolioItems: updatedPortfolio } : null
      );

      setNewPortfolioUrl('');
      setPortfolioModalVisible(false);
    } catch (error) {
      console.error('Error adding portfolio item:', error);
    } finally {
      setSaving(false);
    }
  };

  // Remove portfolio item
  const removePortfolioItem = async (index: number) => {
    if (!user || !db) return;

    if (demoMode) {
      const updatedPortfolio = (profileData?.portfolioItems || []).filter(
        (_, i) => i !== index
      );
      setProfileData((prev) =>
        prev ? { ...prev, portfolioItems: updatedPortfolio } : prev
      );
      return;
    }

    setSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedPortfolio = (profileData?.portfolioItems || []).filter(
        (_, i) => i !== index
      );
      await updateDoc(userDocRef, {
        portfolioItems: updatedPortfolio,
      });

      setProfileData((prev) =>
        prev ? { ...prev, portfolioItems: updatedPortfolio } : null
      );
    } catch (error) {
      console.error('Error removing portfolio item:', error);
    } finally {
      setSaving(false);
    }
  };

  // Calculate profile completion percentage
  const profileCompletion = useMemo(() => {
    if (!profileData) return 0;

    const fields = [
      { key: 'name', weight: 1 },
      { key: 'university', weight: 1 },
      { key: 'course', weight: 1 },
      { key: 'yearOfStudy', weight: 1 },
      { key: 'bio', weight: 1 },
      { key: 'availability', weight: 1 },
      { key: 'profileImageUrl', weight: 1 },
      { key: 'skills', weight: 1 },
      { key: 'portfolioItems', weight: 1 },
    ];

    let completed = 0;
    let total = fields.length;

    fields.forEach(({ key, weight }) => {
      const value = profileData[key as keyof StudentProfileData];
      const isComplete =
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === 'string' && value.trim() !== '') ||
        (value && typeof value === 'boolean');

      if (isComplete) {
        completed += weight;
      }
    });

    return Math.round((completed / total) * 100);
  }, [profileData]);

  // Get user's initials for avatar
  const initials = useMemo(() => {
    const name = profileData?.name || user?.displayName || 'User';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [profileData?.name, user?.displayName]);

  const displayName = profileData?.name || user?.displayName || 'User';
  const displayCourse = profileData?.course || 'Add your course';
  const displayUniversity = profileData?.university || 'Add your university';
  const displaySkills = profileData?.skills || [];
  const displayBio = profileData?.bio || 'No bio added yet';
  const displayAvailability = profileData?.availability || 'Not specified';
  const portfolioCount = profileData?.portfolioItems?.length || 0;
  const followersCount = profileData?.followers?.length || 0;
  const followingCount = profileData?.following?.length || 0;

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.blob3} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.gradient} />
          <View style={styles.profileTop}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.sub}>
              {displayCourse}, {displayUniversity}
            </Text>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>⭐ {profileData?.rating || 0}</Text>
              <Text style={styles.badge}>
                {profileData?.isVerified ? '✓ Verified' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.followSection}>
          <TouchableOpacity onPress={() => loadFollowList('followers')} style={styles.followCard}> 
            <Text style={styles.followNumber}>{followersCount}</Text>
            <Text style={styles.followLabel}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => loadFollowList('following')} style={styles.followCard}> 
            <Text style={styles.followNumber}>{followingCount}</Text>
            <Text style={styles.followLabel}>Following</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Profile Completion */}
          <View style={styles.completionCard}>
            <View style={styles.completionHeader}>
              <Text style={styles.sectionTitle}>Profile Completion</Text>
              <Text style={styles.completionPercent}>{profileCompletion}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${profileCompletion}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {profileCompletion === 100
                ? 'Profile complete! 🎉'
                : `Complete ${100 - profileCompletion}% more to boost visibility`}
            </Text>
          </View>

          {/* Bio */}
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity
            onPress={() =>
              openEditModal('bio', profileData?.bio || '')
            }
            style={styles.editableField}
          >
            <Text style={styles.bodyText}>
              {displayBio === 'No bio added yet'
                ? '📝 Tap to add a bio'
                : displayBio}
            </Text>
            <Text style={styles.editHint}>Tap to edit</Text>
          </TouchableOpacity>

          {/* Education Details */}
          <Text style={styles.sectionTitle}>Education</Text>
          <TouchableOpacity
            onPress={() =>
              openEditModal('university', profileData?.university || '')
            }
            style={styles.infoCard}
          >
            <Text style={styles.infoLabel}>University</Text>
            <View style={styles.editableRow}>
              <Text style={styles.infoValue}>
                {displayUniversity}
              </Text>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() =>
              openEditModal('course', profileData?.course || '')
            }
            style={styles.infoCard}
          >
            <Text style={styles.infoLabel}>Course/Field</Text>
            <View style={styles.editableRow}>
              <Text style={styles.infoValue}>
                {displayCourse}
              </Text>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() =>
              openEditModal('yearOfStudy', profileData?.yearOfStudy || '')
            }
            style={styles.infoCard}
          >
            <Text style={styles.infoLabel}>Year of Study</Text>
            <View style={styles.editableRow}>
              <Text style={styles.infoValue}>
                {profileData?.yearOfStudy || 'Not specified'}
              </Text>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>

          {/* Skills */}
          <Text style={styles.sectionTitle}>Skills</Text>
          {displaySkills.length > 0 ? (
            <View>
              <View style={styles.skillsRow}>
                {displaySkills.map((item) => (
                  <View key={item} style={styles.skillTag}>
                    <Text style={styles.skillText}>{item}</Text>
                    <TouchableOpacity
                      onPress={() => removeSkill(item)}
                      style={styles.skillRemove}
                    >
                      <Text style={styles.skillRemoveText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => setSkillsModalVisible(true)}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>+ Add Skill</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setSkillsModalVisible(true)}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>🛠️ Add Your First Skill</Text>
            </TouchableOpacity>
          )}

          {/* Portfolio */}
          <Text style={styles.sectionTitle}>Portfolio ({portfolioCount})</Text>
          {portfolioCount > 0 ? (
            <View>
              <View style={styles.portfolioGrid}>
                {profileData?.portfolioItems?.map((item, idx) => (
                  <View key={idx} style={styles.portfolioItemContainer}>
                    <Image
                      source={{ uri: item.fileUrl || 'https://via.placeholder.com/80' }}
                      style={styles.portfolioImage}
                    />
                    <TouchableOpacity
                      onPress={() => removePortfolioItem(idx)}
                      style={styles.portfolioRemove}
                    >
                      <Text style={styles.portfolioRemoveText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => setPortfolioModalVisible(true)}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>+ Add Portfolio Item</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setPortfolioModalVisible(true)}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>📁 Upload Your First Portfolio Item</Text>
            </TouchableOpacity>
          )}

          {/* Availability */}
          <Text style={styles.sectionTitle}>Availability</Text>
          <TouchableOpacity
            onPress={() =>
              openEditModal('availability', profileData?.availability || '')
            }
            style={styles.editableField}
          >
            <Text style={styles.bodyText}>
              {displayAvailability === 'Not specified'
                ? '⏰ Tap to set your availability'
                : displayAvailability}
            </Text>
            <Text style={styles.editHint}>Tap to edit</Text>
          </TouchableOpacity>

          {/* Earnings */}
          <Text style={styles.sectionTitle}>Earnings</Text>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsValue}>₦{profileData?.totalEarned || 0}</Text>
            <Text style={styles.earningsLabel}>Total Earned</Text>
          </View>

          {/* Stats */}
          <Text style={styles.sectionTitle}>Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData?.totalRatings || 0}</Text>
              <Text style={styles.statLabel}>Jobs Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{displaySkills.length}</Text>
              <Text style={styles.statLabel}>Skills</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{portfolioCount}</Text>
              <Text style={styles.statLabel}>Portfolio Items</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit {editField}</Text>
            <TouchableOpacity onPress={saveFieldChange} disabled={saving}>
              {saving ? (
                <ActivityIndicator color={palette.primary} />
              ) : (
                <Text style={styles.saveBtn}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>
              {editField ? editField.charAt(0).toUpperCase() + editField.slice(1) : ''}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={`Enter your ${editField}`}
              value={editValue}
              onChangeText={setEditValue}
              multiline={editField === 'bio' || editField === 'availability'}
              placeholderTextColor={palette.textSecondary}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Skills Modal */}
      <Modal
        visible={skillsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSkillsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSkillsModalVisible(false)}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Skill</Text>
            <TouchableOpacity onPress={addSkill} disabled={saving || !newSkill.trim()}>
              {saving ? (
                <ActivityIndicator color={palette.primary} />
              ) : (
                <Text style={[styles.saveBtn, !newSkill.trim() && styles.disabledBtn]}>
                  Add
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Skill Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., React, Figma, Python"
              value={newSkill}
              onChangeText={setNewSkill}
              placeholderTextColor={palette.textSecondary}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Portfolio Modal */}
      <Modal
        visible={portfolioModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPortfolioModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setPortfolioModalVisible(false)}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Portfolio</Text>
            <TouchableOpacity onPress={addPortfolioItem} disabled={saving || !newPortfolioUrl.trim()}>
              {saving ? (
                <ActivityIndicator color={palette.primary} />
              ) : (
                <Text style={[styles.saveBtn, !newPortfolioUrl.trim() && styles.disabledBtn]}>
                  Add
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Image URL</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Paste image URL (e.g., https://...)"
              value={newPortfolioUrl}
              onChangeText={setNewPortfolioUrl}
              placeholderTextColor={palette.textSecondary}
            />
            <Text style={styles.modalHint}>
              You can use cloud storage URLs or image hosting services like Imgur
            </Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Followers / Following Modal */}
      <Modal
        visible={followModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFollowModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setFollowModalVisible(false)}>
              <Text style={styles.cancelBtn}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{followMode === 'followers' ? 'Followers' : 'Following'}</Text>
            <View style={{ width: 50 }} />
          </View>

          <View style={styles.modalContent}>
            {followLoading ? (
              <ActivityIndicator color={palette.primary} />
            ) : followList.length === 0 ? (
              <Text style={styles.bodyText}>
                {followMode === 'followers'
                  ? 'No one is following you yet.'
                  : 'You are not following anyone yet.'}
              </Text>
            ) : (
              followList.map((item) => (
                <View key={item.uid} style={styles.followListItem}>
                  <View style={styles.followAvatar}>
                    <Text style={styles.followAvatarText}>
                      {item.name
                        .split(' ')
                        .map((word) => word[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.followItemText}>
                    <Text style={styles.followName}>{item.name}</Text>
                    <Text style={styles.followRole}>{item.role}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (_palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B0B18' },
  blob1: { position: 'absolute', top: -60, left: '50%', marginLeft: -100, width: 200, height: 200, borderRadius: 100, backgroundColor: '#3D2FA8', opacity: 0.4 },
  blob2: { position: 'absolute', top: 30, right: -20, width: 110, height: 110, borderRadius: 55, backgroundColor: '#6C5CE7', opacity: 0.2 },
  blob3: { position: 'absolute', top: 30, left: -20, width: 90, height: 90, borderRadius: 45, backgroundColor: '#7C3AED', opacity: 0.15 },
  header: { height: 220, overflow: 'hidden', position: 'relative' },
  gradient: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
  profileTop: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 16 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1E1A42', borderWidth: 2.5, borderColor: '#6C5CE7', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { color: '#A78BFA', fontSize: 22, fontWeight: '900' },
  name: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: -0.3 },
  sub: { color: '#6B6A8D', marginTop: 4, fontSize: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  rating: { backgroundColor: '#1E1A42', color: '#A78BFA', fontWeight: '700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, fontSize: 12 },
  badge: { backgroundColor: '#0F2A1E', color: '#34D399', borderWidth: 1, borderColor: '#065F46', padding: 5, borderRadius: 20, fontSize: 11, fontWeight: '700' },
  followSection: { flexDirection: 'row', gap: 10, paddingHorizontal: 24, marginTop: -10, marginBottom: 4 },
  followCard: { flex: 1, backgroundColor: '#161629', borderRadius: 14, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2D2B5E' },
  followNumber: { color: '#E0DEFF', fontSize: 17, fontWeight: '900' },
  followLabel: { color: '#6B6A8D', fontSize: 11, marginTop: 3 },
  content: { flex: 1, backgroundColor: '#0B0B18', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 40 },
  completionCard: { backgroundColor: '#161629', borderRadius: 14, padding: 14, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: '#6C5CE7', borderWidth: 1, borderColor: '#2D2B5E' },
  completionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  completionPercent: { fontSize: 18, fontWeight: '900', color: '#6C5CE7' },
  progressBar: { width: '100%', height: 8, backgroundColor: '#1E1C40', borderRadius: 6, marginVertical: 8, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: '#6C5CE7', borderRadius: 6 },
  progressText: { color: '#6B6A8D', fontSize: 12, marginTop: 4, fontWeight: '500' },
  sectionTitle: { fontSize: 11, fontWeight: '700', marginTop: 20, marginBottom: 10, color: '#A78BFA', letterSpacing: 1.4, textTransform: 'uppercase' },
  bodyText: { color: '#6B6A8D', fontWeight: '500', marginBottom: 16, fontSize: 13 },
  infoCard: { backgroundColor: '#161629', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#2D2B5E' },
  infoLabel: { color: '#6B6A8D', fontSize: 11, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  infoValue: { color: '#E0DEFF', fontSize: 14, fontWeight: '600' },
  editableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editIcon: { fontSize: 14, color: '#6C5CE7' },
  editableField: { backgroundColor: '#161629', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#2D2B5E' },
  editHint: { fontSize: 11, color: '#6C5CE7', fontWeight: '700', marginTop: 8 },
  modalContainer: { flex: 1, backgroundColor: '#0B0B18' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#2D2B5E' },
  cancelBtn: { color: '#6B6A8D', fontSize: 14, fontWeight: '700' },
  saveBtn: { color: '#A78BFA', fontSize: 14, fontWeight: '700' },
  modalTitle: { color: '#E0DEFF', fontSize: 14, fontWeight: '800', textTransform: 'capitalize' },
  modalContent: { flex: 1, padding: 20 },
  modalLabel: { color: '#E0DEFF', fontSize: 15, fontWeight: '700', marginBottom: 12, textTransform: 'capitalize' },
  modalInput: { backgroundColor: '#161629', borderWidth: 1, borderColor: '#2D2B5E', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: '#E0DEFF', fontSize: 14, minHeight: 50 },
  skillTag: { backgroundColor: '#1E1A42', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, marginRight: 8, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  skillText: { color: '#A78BFA', fontWeight: '700', fontSize: 12 },
  skillRemove: { marginLeft: 2 },
  skillRemoveText: { color: '#6C5CE7', fontWeight: '700', fontSize: 13 },
  portfolioGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  portfolioItemContainer: { width: '32%', height: 90, backgroundColor: '#161629', borderRadius: 10, margin: '1%', overflow: 'hidden', position: 'relative' },
  portfolioItem: { width: '32%', height: 90, backgroundColor: '#161629', borderRadius: 10, margin: '1%', overflow: 'hidden' },
  portfolioImage: { width: '100%', height: '100%' },
  portfolioRemove: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  portfolioRemoveText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  addButton: { backgroundColor: '#161629', borderRadius: 12, paddingVertical: 13, paddingHorizontal: 16, borderWidth: 1, borderColor: '#6C5CE7', borderStyle: 'dashed', marginBottom: 16 },
  addButtonText: { color: '#A78BFA', fontWeight: '700', fontSize: 13, textAlign: 'center' },
  disabledBtn: { opacity: 0.4 },
  modalHint: { color: '#6B6A8D', fontSize: 12, marginTop: 12, fontWeight: '500' },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  followListItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2D2B5E' },
  followAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#3D2FA8', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  followAvatarText: { color: '#E0DEFF', fontWeight: '800' },
  followItemText: { flex: 1 },
  followName: { color: '#E0DEFF', fontSize: 14, fontWeight: '700' },
  followRole: { color: '#6B6A8D', fontSize: 12, marginTop: 2 },
  earningsCard: { backgroundColor: '#161629', borderRadius: 14, padding: 18, alignItems: 'center', marginBottom: 16, borderWidth: 1.5, borderColor: '#6C5CE7' },
  earningsValue: { fontSize: 28, fontWeight: '900', color: '#A78BFA' },
  earningsLabel: { color: '#6B6A8D', fontSize: 12, marginTop: 4 },
  statsGrid: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statItem: { flex: 1, backgroundColor: '#161629', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2D2B5E' },
  statNumber: { fontSize: 20, fontWeight: '900', color: '#A78BFA' },
  statLabel: { color: '#6B6A8D', fontSize: 11, marginTop: 4, fontWeight: '500' },
});
