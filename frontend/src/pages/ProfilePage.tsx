import React, { useState } from 'react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentId: string;
  school: string;
  year: string;
  major: string;
  minor?: string;
  gpa?: number;
  avatar?: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    darkMode: boolean;
    language: string;
  };
}

const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@uwaterloo.ca',
  studentId: '20123456',
  school: 'University of Waterloo',
  year: '3rd Year',
  major: 'Computer Science',
  minor: 'Mathematics',
  gpa: 3.85,
  preferences: {
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    language: 'English'
  }
};

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(mockUserProfile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const updatePreference = (key: keyof UserProfile['preferences'], value: boolean | string) => {
    setEditedProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const stats = [
    { label: 'Courses Enrolled', value: '6', icon: '📚' },
    { label: 'Credits Completed', value: '72', icon: '🎓' },
    { label: 'Current GPA', value: profile.gpa?.toFixed(2) || 'N/A', icon: '📊' },
    { label: 'Semester', value: 'Fall 2024', icon: '📅' }
  ];

  return (
    <div className="container-premium py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="heading-premium">Your Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary-premium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button onClick={handleCancel} className="btn-secondary-premium">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary-premium">
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card-premium">
              <div className="card-premium-body text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl font-bold">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="input-premium text-center"
                      placeholder="Full Name"
                    />
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="input-premium text-center"
                      placeholder="Email"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h2>
                    <p className="text-gray-600 mb-2">{profile.email}</p>
                    <p className="text-sm text-gray-500">Student ID: {profile.studentId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Stats */}
            <div className="card-premium mt-6">
              <div className="card-premium-header">
                <h3 className="text-lg font-semibold text-gray-900">Academic Stats</h3>
              </div>
              <div className="card-premium-body">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Academic Information */}
            <div className="card-premium">
              <div className="card-premium-header">
                <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
              </div>
              <div className="card-premium-body">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                      <input
                        type="text"
                        value={editedProfile.school}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, school: e.target.value }))}
                        className="input-premium"
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                      <select
                        value={editedProfile.year}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, year: e.target.value }))}
                        className="input-premium"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
                      <input
                        type="text"
                        value={editedProfile.major}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, major: e.target.value }))}
                        className="input-premium"
                        placeholder="Major"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minor (Optional)</label>
                      <input
                        type="text"
                        value={editedProfile.minor || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, minor: e.target.value }))}
                        className="input-premium"
                        placeholder="Minor"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500">School</label>
                      <p className="text-gray-900 font-medium">{profile.school}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Year</label>
                      <p className="text-gray-900 font-medium">{profile.year}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Major</label>
                      <p className="text-gray-900 font-medium">{profile.major}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Minor</label>
                      <p className="text-gray-900 font-medium">{profile.minor || 'None'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="card-premium">
              <div className="card-premium-header">
                <h3 className="text-lg font-semibold text-gray-900">Settings & Preferences</h3>
              </div>
              <div className="card-premium-body">
                <div className="space-y-6">
                  {/* Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications about course updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEditing ? editedProfile.preferences.notifications : profile.preferences.notifications}
                        onChange={(e) => isEditing && updatePreference('notifications', e.target.checked)}
                        className="sr-only peer"
                        disabled={!isEditing}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  {/* Email Updates */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Updates</h4>
                      <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEditing ? editedProfile.preferences.emailUpdates : profile.preferences.emailUpdates}
                        onChange={(e) => isEditing && updatePreference('emailUpdates', e.target.checked)}
                        className="sr-only peer"
                        disabled={!isEditing}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  {/* Language */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Language</h4>
                      <p className="text-sm text-gray-500">Choose your preferred language</p>
                    </div>
                    {isEditing ? (
                      <select
                        value={editedProfile.preferences.language}
                        onChange={(e) => updatePreference('language', e.target.value)}
                        className="input-premium w-32"
                      >
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="Spanish">Spanish</option>
                      </select>
                    ) : (
                      <span className="text-gray-900 font-medium">{profile.preferences.language}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="card-premium">
              <div className="card-premium-header">
                <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
              </div>
              <div className="card-premium-body">
                <div className="space-y-4">
                  <button className="btn-secondary-premium w-full">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Change Password
                  </button>
                  <button className="btn-secondary-premium w-full">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Data
                  </button>
                  <button className="w-full text-left px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200">
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
