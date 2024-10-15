const API_BASE_URL = 'http://localhost:8080/api';

export const fetchAttachments = async (taskId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attachments/task/${taskId}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    if (!response.ok) {
      throw new Error('Error fetching attachments');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching attachments:', error);
    throw error;
  }
};

export const createAttachment = async (taskId, attachment) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attachments/task/${taskId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName: attachment.name,
        content: attachment.content,
        url: '' // You might want to generate a URL or leave it empty
      })
    });
    if (!response.ok) {
      throw new Error('Error creating attachment');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating attachment:', error);
    throw error;
  }
};

export const updateAttachment = async (attachmentId, updatedAttachment) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attachments/${attachmentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName: updatedAttachment.fileName,
        url: updatedAttachment.url,
        content: updatedAttachment.content
      })
    });
    if (!response.ok) {
      throw new Error('Error updating attachment');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating attachment:', error);
    throw error;
  }
};

export const deleteAttachment = async (attachmentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attachments/${attachmentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    if (!response.ok) {
      throw new Error('Error deleting attachment');
    }
    return true;
  } catch (error) {
    console.error('Error deleting attachment:', error);
    throw error;
  }
};