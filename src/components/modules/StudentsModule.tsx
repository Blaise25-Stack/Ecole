import { useState, useEffect } from 'react';
import { StudentsList } from '../students/StudentsList';
import { NewStudentForm } from '../students/NewStudentForm';
import { EnrollmentsManagement } from '../students/EnrollmentsManagement';
import { ClassesManagement } from '../students/ClassesManagement';
import { GradesManagement } from '../students/GradesManagement';
import { Calendar, FileText, Users, CheckCircle } from 'lucide-react';

interface StudentsModuleProps {
  activeSubmenu?: string;
}

export function StudentsModule({ activeSubmenu: propSubmenu }: StudentsModuleProps) {
  const [activeSubmenu, setActiveSubmenu] = useState(propSubmenu || 'list');
  const [showNewStudentForm, setShowNewStudentForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (propSubmenu) {
      setActiveSubmenu(propSubmenu);
    }
  }, [propSubmenu]);

  const handleStudentAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'list':
        return (
          <>
            <StudentsList
              key={refreshKey}
              onAddStudent={() => setShowNewStudentForm(true)}
            />
            {showNewStudentForm && (
              <NewStudentForm
                onClose={() => setShowNewStudentForm(false)}
                onSuccess={handleStudentAdded}
              />
            )}
          </>
        );

      case 'enrollment':
        return <EnrollmentsManagement />;

      case 'classes':
        return <ClassesManagement />;

      case 'grades':
        return <GradesManagement />;

      case 'attendance':
        return (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Module en construction</h3>
            <p className="text-gray-600">Le module de gestion des présences sera disponible prochainement.</p>
          </div>
        );

      case 'timetable':
        return (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Module en construction</h3>
            <p className="text-gray-600">Le module d'emploi du temps sera disponible prochainement.</p>
          </div>
        );

      case 'certificates':
        return (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Module en construction</h3>
            <p className="text-gray-600">Le module d'attestations sera disponible prochainement.</p>
          </div>
        );

      case 'parents':
        return (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Module en construction</h3>
            <p className="text-gray-600">Le module de gestion des parents sera disponible prochainement.</p>
          </div>
        );

      default:
        return (
          <>
            <StudentsList
              key={refreshKey}
              onAddStudent={() => setShowNewStudentForm(true)}
            />
            {showNewStudentForm && (
              <NewStudentForm
                onClose={() => setShowNewStudentForm(false)}
                onSuccess={handleStudentAdded}
              />
            )}
          </>
        );
    }
  };

  return <div>{renderContent()}</div>;
}
