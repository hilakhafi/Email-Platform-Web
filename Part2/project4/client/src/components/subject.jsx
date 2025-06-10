// טופס 2: Subject Form
function SubjectForm({ data, onUpdate, onNext, onPrev, onCancel }) {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onUpdate(formData);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📝</span>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Subject & Settings</h3>
          <p className="text-sm text-gray-600">What's this email about?</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Enter email subject..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
              errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority:</label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="normal">🟡 Normal Priority</option>
            <option value="high">🔴 High Priority</option>
            <option value="urgent">⚡ Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category:</label>
          <select
            value={formData.category || 'general'}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="general">📁 General</option>
            <option value="work">💼 Work</option>
            <option value="personal">👤 Personal</option>
            <option value="marketing">📢 Marketing</option>
            <option value="support">🛠️ Support</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <div className="flex gap-3">
          <button
            onClick={onPrev}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next: Compose →
          </button>
        </div>
      </div>
    </div>
  );
}