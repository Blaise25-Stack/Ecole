import { useState, useEffect } from 'react';
import { X, Upload, UserCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface NewStudentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function NewStudentForm({ onClose, onSuccess }: NewStudentFormProps) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    registration_number: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: 'Male',
    date_of_birth: '',
    place_of_birth: '',
    address: '',
    phone: '',
    email: '',
    photo_url: '',
    class_id: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchClasses();
    generateRegistrationNumber();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name, code')
        .eq('company_id', profile?.company_id)
        .order('name');

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const generateRegistrationNumber = async () => {
    try {
      const { count, error } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', profile?.company_id);

      if (error) throw error;
      const nextNumber = (count || 0) + 1;
      const year = new Date().getFullYear();
      setFormData((prev) => ({
        ...prev,
        registration_number: `STU${year}${String(nextNumber).padStart(4, '0')}`,
      }));
    } catch (error) {
      console.error('Error generating registration number:', error);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setFormData((prev) => ({ ...prev, photo_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'Le prénom est requis';
    if (!formData.last_name.trim()) newErrors.last_name = 'Le nom est requis';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'La date de naissance est requise';
    if (!formData.gender) newErrors.gender = 'Le sexe est requis';
    if (!formData.class_id) newErrors.class_id = 'La classe est requise';

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const studentData = {
        company_id: profile?.company_id,
        registration_number: formData.registration_number,
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name.trim() || null,
        last_name: formData.last_name.trim(),
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        place_of_birth: formData.place_of_birth.trim() || null,
        address: formData.address.trim() || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        photo_url: formData.photo_url || null,
        status: 'active',
      };

      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert(studentData)
        .select()
        .single();

      if (studentError) throw studentError;

      const { data: academicYear } = await supabase
        .from('academic_years')
        .select('id')
        .eq('company_id', profile?.company_id)
        .eq('is_current', true)
        .single();

      if (academicYear && formData.class_id) {
        const { error: enrollmentError } = await supabase.from('enrollments').insert({
          student_id: student.id,
          class_id: formData.class_id,
          academic_year_id: academicYear.id,
          enrollment_date: new Date().toISOString().split('T')[0],
          status: 'enrolled',
        });

        if (enrollmentError) throw enrollmentError;
      }

      alert('Étudiant ajouté avec succès');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating student:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Nouvel Étudiant</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200">
                    <UserCircle className="w-20 h-20 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo de profil
                </label>
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition">
                  <Upload className="w-5 h-5" />
                  <span>Télécharger une photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG (max 2MB)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matricule <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sexe <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="Male">Masculin</option>
                <option value="Female">Féminin</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postnom
              </label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date_of_birth && (
                <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu de naissance
              </label>
              <input
                type="text"
                name="place_of_birth"
                value={formData.place_of_birth}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classe <span className="text-red-500">*</span>
              </label>
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.class_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner une classe</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              {errors.class_id && <p className="text-red-500 text-sm mt-1">{errors.class_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
