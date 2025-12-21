import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../services/firebase';
import api from '../../services/api';
import { User, Shield, Award, Camera, Save, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../utils/imageUpload';
import SEO from '../../components/common/SEO';

const Profile = () => {
    const { user, refreshUser, loading: authLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [displayName, setDisplayName] = useState(user?.displayName || user?.name || '');
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.photo || user?.image || user?.photoURL || '');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            let photoURL = user?.photoURL; // Default to existing

            // 1. Upload Image ONLY if a new file is selected
            if (imageFile) {
                const uploadToast = toast.loading('Uploading new profile picture...');
                try {
                    photoURL = await uploadImage(imageFile);
                    toast.dismiss(uploadToast);
                } catch (err) {
                    toast.dismiss(uploadToast);
                    console.error("Image upload error", err);
                    toast.error('Image upload failed. Profile update aborted.');
                    setIsSaving(false);
                    return;
                }
            }

            // 2. Update Firebase Auth Profile
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: displayName,
                    photoURL: photoURL
                });
                await auth.currentUser.reload(); // Reload to ensure sync gets latest data
            }

            // 3. Update MongoDB Backend (PATCH /user/me)
            await api.patch('/user/me', {
                name: displayName,
                photo: photoURL
            });

            // 4. Update Context
            await refreshUser();

            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Profile update failed:', error);
            toast.error('Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading) return <div className="p-10 text-center">Loading profile...</div>;

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
            <SEO title="My Profile" description="Manage your Rewise profile and settings." />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header / Cover */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative"></div>

                <div className="px-8 pb-8">
                    {/* Avatar */}
                    <div className="relative -mt-16 mb-6 flex justify-between items-end">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative">
                                <img
                                    src={previewUrl || user?.photo || user?.image || user?.photoURL || `https://ui-avatars.com/api/?name=${displayName || 'User'}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <Camera className="text-white opacity-80" size={32} />
                                    </div>
                                )}
                            </div>

                            {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer shadow-sm hover:bg-blue-700 transition-colors z-10">
                                    <Camera size={16} />
                                    <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                                </label>
                            )}
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Info */}
                    {!isEditing ? (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{user?.displayName || user?.name}</h1>
                                <p className="text-gray-500">{user?.email}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Role</p>
                                        <p className="font-medium text-gray-900 capitalize">{user?.role || 'User'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                    <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                                        <Award size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Membership</p>
                                        <p className="font-medium text-gray-900">{user?.isPremium ? 'Premium Member' : 'Free Account'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>

                            {/* Improved File Upload UI */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Change Profile Picture</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                                {imageFile && (
                                    <p className="text-sm text-green-600 mt-2 font-medium">Selected: {imageFile.name}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setImageFile(null);
                                        setPreviewUrl(user?.photoURL);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition-colors flex items-center gap-2"
                                >
                                    {isSaving ? 'Saving...' : <> <Save size={18} /> Save Changes </>}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
