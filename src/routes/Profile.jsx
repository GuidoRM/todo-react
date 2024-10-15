import { BiPlus, BiUser } from 'react-icons/bi';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import useModal from '../hooks/useModal';
import { useAuth } from '../AuthContext';
import useFetch from '../hooks/useFetch';

function Profile() {
  const { isAuthenticated, userId } = useAuth();
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImage: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated, userId]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUserProfile(userData.data || {
          firstName: '',
          lastName: '',
          email: '',
          profileImage: null
        });
      } else {
        console.error('Error fetching user profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('firstName', userProfile.firstName || '');
    formData.append('lastName', userProfile.lastName || '');
    formData.append('email', userProfile.email || '');

    if (userProfile.profileImage instanceof File) {
      formData.append('profileImage', userProfile.profileImage);
    }

    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserProfile(updatedUser.data);
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        console.error('Error updating profile:', errorData);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };


  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setUserProfile({ ...userProfile, profileImage: file });
      };
      reader.readAsDataURL(file);
    }
  };



  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-6 bg-gray-800 shadow-md relative">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
        </header>
        <div className="flex-1 flex justify-center items-center p-8">
          <div className="w-full max-w-md">
            {isEditing ? (
              <form onSubmit={handleEditProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Nombre</label>
                  <input
                    type="text"
                    value={userProfile.firstName || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-gray-600 focus:ring-0 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Apellido</label>
                  <input
                    type="text"
                    value={userProfile.lastName || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-gray-600 focus:ring-0 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    value={userProfile.email || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-indigo-500 focus:bg-gray-600 focus:ring-0 text-white"
                  />
                </div>
                <div>
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : userProfile.profileImage ? (
                    <img
                      src={`data:image/jpeg;base64,${userProfile.profileImage}`}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <BiUser className="w-32 h-32 text-gray-400" />
                  )}

                  <label className="block text-sm font-medium text-gray-300">Imagen de Perfil</label>
                  <input
                    type="file"
                    onChange={handleProfileImageChange}
                    className="mt-1 block w-full text-sm text-gray-300
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-600 file:text-white
                      hover:file:bg-indigo-700"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  {userProfile.profileImage ? (
                    <img
                      src={`data:image/jpeg;base64,${userProfile.profileImage}`}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <BiUser className="w-32 h-32 text-gray-400" />
                  )}
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-semibold">{`${userProfile.firstName || ''} ${userProfile.lastName || ''}`}</h2>
                  <p className="text-gray-400">{userProfile.email || ''}</p>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Editar Perfil
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;