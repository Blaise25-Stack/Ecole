import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Class {
  id: string;
  name: string;
  code: string;
  capacity: number;
  section: string | null;
  room_number: string | null;
  level: {
    name: string;
  };
  academic_year: {
    name: string;
  };
  enrollment_count?: number;
}

export function ClassesManagement() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [academicYear, setAcademicYear] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    level_id: '',
    capacity: 30,
    section: '',
    room_number: '',
  });

  useEffect(() => {
    if (profile?.company_id) {
      fetchClasses();
      fetchLevels();
      fetchAcademicYear();
    }
  }, [profile?.company_id]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          level:levels(name),
          academic_year:academic_years(name)
        `)
        .eq('company_id', profile?.company_id)
        .order('name');

      if (error) throw error;

      const classIds = data?.map(c => c.id) || [];
      let enrollmentCounts: any = {};

      if (classIds.length > 0) {
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('class_id')
          .in('class_id', classIds)
          .eq('status', 'enrolled');

        enrollments?.forEach((enr: any) => {
          enrollmentCounts[enr.class_id] = (enrollmentCounts[enr.class_id] || 0) + 1;
        });
      }

      const processedClasses = data?.map((cls: any) => ({
        ...cls,
        enrollment_count: enrollmentCounts[cls.id] || 0,
      })) || [];

      setClasses(processedClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLevels = async () => {
    try {
      const { data, error } = await supabase
        .from('levels')
        .select('id, name, code')
        .eq('company_id', profile?.company_id)
        .order('order_number');

      if (error) throw error;
      setLevels(data || []);
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  const fetchAcademicYear = async () => {
    try {
      const { data, error } = await supabase
        .from('academic_years')
        .select('id, name')
        .eq('company_id', profile?.company_id)
        .eq('is_current', true)
        .single();

      if (error) throw error;
      setAcademicYear(data);
    } catch (error) {
      console.error('Error fetching academic year:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.code || !formData.level_id) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    if (!academicYear) {
      alert('Aucune année scolaire active trouvée');
      return;
    }

    try {
      const { error } = await supabase.from('classes').insert({
        company_id: profile?.company_id,
        name: formData.name.trim(),
        code: formData.code.trim(),
        level_id: formData.level_id,
        academic_year_id: academicYear.id,
        capacity: formData.capacity,
        section: formData.section.trim() || null,
        room_number: formData.room_number.trim() || null,
      });

      if (error) throw error;

      alert('Classe créée avec succès');
      setShowForm(false);
      setFormData({
        name: '',
        code: '',
        level_id: '',
        capacity: 30,
        section: '',
        room_number: '',
      });
      fetchClasses();
    } catch (error: any) {
      console.error('Error creating class:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) return;

    try {
      const { error } = await supabase.from('classes').delete().eq('id', id);
      if (error) throw error;
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Classes</h2>
          <p className="text-gray-600 mt-1">{classes.length} classe(s)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-5 h-5" />
          Nouvelle classe
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Nouvelle Classe</h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: 1ère Année A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ex: 1A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.level_id}
                  onChange={(e) => setFormData({ ...formData, level_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un niveau</option>
                  {levels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacité
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="Ex: Scientifique"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de salle
                </label>
                <input
                  type="text"
                  value={formData.room_number}
                  onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                  placeholder="Ex: A101"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Créer la classe
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 font-medium">Aucune classe trouvée</p>
            <p className="text-gray-500 text-sm mt-1">Créez votre première classe</p>
          </div>
        ) : (
          classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{cls.name}</h3>
                  <p className="text-sm text-gray-600">{cls.level.name}</p>
                </div>
                <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {cls.code}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {cls.section && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Section:</span> {cls.section}
                  </p>
                )}
                {cls.room_number && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Salle:</span> {cls.room_number}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Capacité:</span> {cls.capacity} élèves
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 font-medium">{cls.enrollment_count}</span>
                  <span className="text-gray-600">/ {cls.capacity} inscrits</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
                  <Users className="w-4 h-4" />
                  Gérer
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cls.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
