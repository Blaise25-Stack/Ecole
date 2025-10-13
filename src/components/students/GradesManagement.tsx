import { useState, useEffect } from 'react';
import { FileText, Download, Award, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Grade {
  id: string;
  score: number;
  max_score: number;
  grade_type: string;
  date: string;
  comments: string | null;
  subject: {
    name: string;
    coefficient: number;
  };
  enrollment: {
    student: {
      first_name: string;
      last_name: string;
      middle_name: string | null;
      registration_number: string;
    };
  };
}

export function GradesManagement() {
  const { profile } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [periods, setPeriods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [showGradeForm, setShowGradeForm] = useState(false);

  const [gradeFormData, setGradeFormData] = useState({
    enrollment_id: '',
    subject_id: '',
    academic_period_id: '',
    score: '',
    max_score: '100',
    grade_type: 'exam',
    date: new Date().toISOString().split('T')[0],
    comments: '',
  });

  useEffect(() => {
    if (profile?.company_id) {
      fetchClasses();
      fetchSubjects();
      fetchPeriods();
    }
  }, [profile?.company_id]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsByClass(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedStudent && selectedPeriod) {
      fetchGrades();
    }
  }, [selectedStudent, selectedPeriod]);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name')
        .eq('company_id', profile?.company_id)
        .order('name');

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name, coefficient')
        .eq('company_id', profile?.company_id)
        .order('name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchPeriods = async () => {
    try {
      const { data: academicYear } = await supabase
        .from('academic_years')
        .select('id')
        .eq('company_id', profile?.company_id)
        .eq('is_current', true)
        .single();

      if (!academicYear) return;

      const { data, error } = await supabase
        .from('academic_periods')
        .select('id, name')
        .eq('academic_year_id', academicYear.id)
        .order('order_number');

      if (error) throw error;
      setPeriods(data || []);
    } catch (error) {
      console.error('Error fetching periods:', error);
    }
  };

  const fetchStudentsByClass = async (classId: string) => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          student:students(id, first_name, last_name, middle_name, registration_number)
        `)
        .eq('class_id', classId)
        .eq('status', 'enrolled');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          subject:subjects(name, coefficient),
          enrollment:enrollments(
            student:students(first_name, last_name, middle_name, registration_number)
          )
        `)
        .eq('enrollment_id', selectedStudent)
        .eq('academic_period_id', selectedPeriod)
        .order('date', { ascending: false });

      if (error) throw error;
      setGrades(data || []);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from('grades').insert({
        enrollment_id: gradeFormData.enrollment_id,
        subject_id: gradeFormData.subject_id,
        academic_period_id: gradeFormData.academic_period_id,
        score: parseFloat(gradeFormData.score),
        max_score: parseFloat(gradeFormData.max_score),
        grade_type: gradeFormData.grade_type,
        date: gradeFormData.date,
        comments: gradeFormData.comments || null,
        created_by: profile?.id,
      });

      if (error) throw error;

      alert('Note ajoutée avec succès');
      setShowGradeForm(false);
      setGradeFormData({
        enrollment_id: '',
        subject_id: '',
        academic_period_id: '',
        score: '',
        max_score: '100',
        grade_type: 'exam',
        date: new Date().toISOString().split('T')[0],
        comments: '',
      });
      fetchGrades();
    } catch (error: any) {
      console.error('Error adding grade:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  const calculateAverage = () => {
    if (grades.length === 0) return 0;
    const totalWeighted = grades.reduce(
      (sum, grade) => sum + (grade.score / grade.max_score) * 100 * (grade.subject.coefficient || 1),
      0
    );
    const totalCoefficients = grades.reduce((sum, grade) => sum + (grade.subject.coefficient || 1), 0);
    return totalCoefficients > 0 ? (totalWeighted / totalCoefficients).toFixed(2) : 0;
  };

  const generateBulletin = () => {
    if (!selectedStudent || grades.length === 0) {
      alert('Veuillez sélectionner un étudiant et une période avec des notes');
      return;
    }

    const student = students.find((s) => s.id === selectedStudent)?.student;
    if (!student) return;

    const average = calculateAverage();

    const bulletinContent = `
BULLETIN SCOLAIRE

Étudiant: ${student.last_name} ${student.middle_name || ''} ${student.first_name}
Matricule: ${student.registration_number}
Période: ${periods.find((p) => p.id === selectedPeriod)?.name}

------------------------------------------------------
Matière              Note    /Max    Coef    Note/20
------------------------------------------------------
${grades
  .map(
    (g) =>
      `${g.subject.name.padEnd(20)} ${g.score.toString().padEnd(7)} /${g.max_score.toString().padEnd(6)} ${g.subject.coefficient.toString().padEnd(7)} ${((g.score / g.max_score) * 20).toFixed(2)}`
  )
  .join('\n')}
------------------------------------------------------

MOYENNE GÉNÉRALE: ${average}/20

`;

    const blob = new Blob([bulletinContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bulletin_${student.registration_number}.txt`;
    link.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notes & Bulletins</h2>
          <p className="text-gray-600 mt-1">Gestion des notes et génération de bulletins</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Filtres</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classe</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedStudent('');
                setGrades([]);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Étudiant</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={!selectedClass}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Sélectionner un étudiant</option>
              {students.map((enrollment) => (
                <option key={enrollment.id} value={enrollment.id}>
                  {enrollment.student.registration_number} - {enrollment.student.last_name}{' '}
                  {enrollment.student.first_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une période</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedStudent && selectedPeriod && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl px-6 py-4 shadow-lg">
              <p className="text-sm opacity-90 mb-1">Moyenne Générale</p>
              <p className="text-4xl font-bold">{calculateAverage()}/20</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setGradeFormData({
                    ...gradeFormData,
                    enrollment_id: selectedStudent,
                    academic_period_id: selectedPeriod,
                  });
                  setShowGradeForm(true);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Plus className="w-5 h-5" />
                Ajouter une note
              </button>
              <button
                onClick={generateBulletin}
                disabled={grades.length === 0}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                Exporter Bulletin
              </button>
            </div>
          </div>

          {showGradeForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ajouter une note</h3>
              <form onSubmit={handleAddGrade}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Matière <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={gradeFormData.subject_id}
                      onChange={(e) =>
                        setGradeFormData({ ...gradeFormData, subject_id: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Sélectionner une matière</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name} (Coef: {subject.coefficient})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={gradeFormData.grade_type}
                      onChange={(e) =>
                        setGradeFormData({ ...gradeFormData, grade_type: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="exam">Examen</option>
                      <option value="test">Test</option>
                      <option value="quiz">Interrogation</option>
                      <option value="assignment">Devoir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={gradeFormData.score}
                      onChange={(e) =>
                        setGradeFormData({ ...gradeFormData, score: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note maximale
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={gradeFormData.max_score}
                      onChange={(e) =>
                        setGradeFormData({ ...gradeFormData, max_score: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={gradeFormData.date}
                      onChange={(e) =>
                        setGradeFormData({ ...gradeFormData, date: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commentaires
                    </label>
                    <textarea
                      value={gradeFormData.comments}
                      onChange={(e) =>
                        setGradeFormData({ ...gradeFormData, comments: e.target.value })
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowGradeForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Matière
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Note
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Note/20
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Coef
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Aucune note trouvée</p>
                      <p className="text-gray-500 text-sm mt-1">Ajoutez la première note</p>
                    </td>
                  </tr>
                ) : (
                  grades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {grade.subject.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {grade.grade_type === 'exam'
                          ? 'Examen'
                          : grade.grade_type === 'test'
                          ? 'Test'
                          : grade.grade_type === 'quiz'
                          ? 'Interrogation'
                          : 'Devoir'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {grade.score}/{grade.max_score}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-blue-600">
                        {((grade.score / grade.max_score) * 20).toFixed(2)}/20
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{grade.subject.coefficient}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(grade.date).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
