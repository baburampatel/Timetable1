// Application data storage
let appData = {
    courses: [],
    faculty: [],
    students: [],
    rooms: [],
    timetable: {},
    conflicts: [],
    timeSlots: [
        { id: "9", label: "9:00 AM - 10:00 AM" },
        { id: "10", label: "10:00 AM - 11:00 AM" },
        { id: "11", label: "11:00 AM - 12:00 PM" },
        { id: "12", label: "12:00 PM - 1:00 PM" },
        { id: "14", label: "2:00 PM - 3:00 PM" },
        { id: "15", label: "3:00 PM - 4:00 PM" },
        { id: "16", label: "4:00 PM - 5:00 PM" },
        { id: "17", label: "5:00 PM - 6:00 PM" }
    ],
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
};

// Bulk CSV Template
const bulkCSVTemplate = `TYPE,ID,Name,Field1,Field2,Field3,Field4,Field5
COURSE,CS101,Programming Fundamentals,3,Dr. Smith,"S001,S003,S005,S007",,
COURSE,MA201,Advanced Calculus,2,Prof. Johnson,"S002,S004,S006",,
COURSE,PH301,Quantum Physics,2,Dr. Brown,"S001,S002,S008",,
COURSE,EN102,Technical Writing,2,Ms. Davis,"S003,S004,S005,S009",,
COURSE,CH201,Organic Chemistry,3,Dr. Wilson,"S006,S007,S008,S010",,
FACULTY,F001,Dr. Smith,CS101,"Mon-9,Mon-10,Wed-9,Wed-10,Fri-9,Fri-10,Fri-11",,
FACULTY,F002,Prof. Johnson,MA201,"Tue-10,Tue-11,Thu-10,Thu-11,Fri-14,Fri-15",,
FACULTY,F003,Dr. Brown,PH301,"Mon-14,Mon-15,Wed-14,Wed-15,Thu-14",,
FACULTY,F004,Ms. Davis,EN102,"Tue-9,Tue-14,Thu-9,Thu-15,Fri-12",,
FACULTY,F005,Dr. Wilson,CH201,"Mon-11,Mon-12,Wed-11,Wed-12,Fri-16,Fri-17",,
STUDENT,S001,Alice Johnson,"CS101,PH301",,,,
STUDENT,S002,Bob Smith,"MA201,PH301",,,,
STUDENT,S003,Carol Brown,"CS101,EN102",,,,
STUDENT,S004,David Wilson,"MA201,EN102",,,,
STUDENT,S005,Eve Davis,"CS101,EN102",,,,
STUDENT,S006,Frank Miller,"MA201,CH201",,,,
STUDENT,S007,Grace Taylor,"CS101,CH201",,,,
STUDENT,S008,Henry Anderson,"PH301,CH201",,,,
STUDENT,S009,Ivy Thomas,EN102,,,,
STUDENT,S010,Jack Martinez,CH201,,,,
ROOM,R101,Room 101,30,"Mon-9,Mon-10,Mon-11,Tue-9,Tue-10,Wed-9,Wed-10,Thu-9,Thu-10,Fri-9,Fri-10",,,
ROOM,R102,Room 102,25,"Mon-14,Mon-15,Tue-14,Tue-15,Wed-14,Wed-15,Thu-14,Thu-15,Fri-14,Fri-15",,,
ROOM,R201,Room 201,20,"Mon-11,Mon-12,Tue-11,Tue-12,Wed-11,Wed-12,Thu-11,Thu-12,Fri-11,Fri-12",,,
ROOM,LAB1,Computer Lab,40,"Mon-16,Mon-17,Wed-16,Wed-17,Fri-16,Fri-17",,,`;

// CSV Templates
const csvTemplates = {
    courses: "course_id,course_name,sessions_per_week,faculty_name,enrolled_students\nCS101,Programming Fundamentals,3,Dr. Smith,\"S001,S003,S005,S007\"\nMA201,Advanced Calculus,2,Prof. Johnson,\"S002,S004,S006\"",
    faculty: "faculty_id,faculty_name,available_courses,availability_slots\nF001,Dr. Smith,CS101,\"Mon-9,Mon-10,Wed-9,Wed-10,Fri-9,Fri-10\"\nF002,Prof. Johnson,MA201,\"Tue-10,Tue-11,Thu-10,Thu-11\"",
    students: "student_id,student_name,enrolled_courses\nS001,Alice Johnson,\"CS101,PH301\"\nS002,Bob Smith,\"MA201,PH301\"",
    rooms: "room_id,room_name,capacity,available_slots\nR101,Room 101,30,\"Mon-9,Mon-10,Mon-11,Tue-9,Tue-10\"\nR102,Room 102,25,\"Mon-14,Mon-15,Tue-14,Tue-15\""
};

// Sample data
const sampleData = {
    courses: [
        {"id": "CS101", "name": "Programming Fundamentals", "sessionsPerWeek": 3, "faculty": "Dr. Smith", "students": ["S001", "S003", "S005", "S007"]},
        {"id": "MA201", "name": "Advanced Calculus", "sessionsPerWeek": 2, "faculty": "Prof. Johnson", "students": ["S002", "S004", "S006"]},
        {"id": "PH301", "name": "Quantum Physics", "sessionsPerWeek": 2, "faculty": "Dr. Brown", "students": ["S001", "S002", "S008"]},
        {"id": "EN102", "name": "Technical Writing", "sessionsPerWeek": 2, "faculty": "Ms. Davis", "students": ["S003", "S004", "S005", "S009"]},
        {"id": "CH201", "name": "Organic Chemistry", "sessionsPerWeek": 3, "faculty": "Dr. Wilson", "students": ["S006", "S007", "S008", "S010"]}
    ],
    faculty: [
        {"id": "F001", "name": "Dr. Smith", "courses": ["CS101"], "availability": ["Mon-9", "Mon-10", "Wed-9", "Wed-10", "Fri-9", "Fri-10", "Fri-11"]},
        {"id": "F002", "name": "Prof. Johnson", "courses": ["MA201"], "availability": ["Tue-10", "Tue-11", "Thu-10", "Thu-11", "Fri-14", "Fri-15"]},
        {"id": "F003", "name": "Dr. Brown", "courses": ["PH301"], "availability": ["Mon-14", "Mon-15", "Wed-14", "Wed-15", "Thu-14"]},
        {"id": "F004", "name": "Ms. Davis", "courses": ["EN102"], "availability": ["Tue-9", "Tue-14", "Thu-9", "Thu-15", "Fri-12"]},
        {"id": "F005", "name": "Dr. Wilson", "courses": ["CH201"], "availability": ["Mon-11", "Mon-12", "Wed-11", "Wed-12", "Fri-16", "Fri-17"]}
    ],
    students: [
        {"id": "S001", "name": "Alice Johnson", "courses": ["CS101", "PH301"]},
        {"id": "S002", "name": "Bob Smith", "courses": ["MA201", "PH301"]},
        {"id": "S003", "name": "Carol Brown", "courses": ["CS101", "EN102"]},
        {"id": "S004", "name": "David Wilson", "courses": ["MA201", "EN102"]},
        {"id": "S005", "name": "Eve Davis", "courses": ["CS101", "EN102"]},
        {"id": "S006", "name": "Frank Miller", "courses": ["MA201", "CH201"]},
        {"id": "S007", "name": "Grace Taylor", "courses": ["CS101", "CH201"]},
        {"id": "S008", "name": "Henry Anderson", "courses": ["PH301", "CH201"]},
        {"id": "S009", "name": "Ivy Thomas", "courses": ["EN102"]},
        {"id": "S010", "name": "Jack Martinez", "courses": ["CH201"]}
    ],
    rooms: [
        {"id": "R101", "name": "Room 101", "capacity": 30, "availability": ["Mon-9", "Mon-10", "Mon-11", "Tue-9", "Tue-10", "Wed-9", "Wed-10", "Thu-9", "Thu-10", "Fri-9", "Fri-10"]},
        {"id": "R102", "name": "Room 102", "capacity": 25, "availability": ["Mon-14", "Mon-15", "Tue-14", "Tue-15", "Wed-14", "Wed-15", "Thu-14", "Thu-15", "Fri-14", "Fri-15"]},
        {"id": "R201", "name": "Room 201", "capacity": 20, "availability": ["Mon-11", "Mon-12", "Tue-11", "Tue-12", "Wed-11", "Wed-12", "Thu-11", "Thu-12", "Fri-11", "Fri-12"]},
        {"id": "LAB1", "name": "Computer Lab", "capacity": 40, "availability": ["Mon-16", "Mon-17", "Wed-16", "Wed-17", "Fri-16", "Fri-17"]}
    ]
};

// Import state
let importState = {
    currentStep: 0,
    dataType: '',
    csvData: null,
    parsedData: [],
    validData: [],
    errors: []
};

// Bulk import state
let bulkImportState = {
    csvData: null,
    parsedData: [],
    importResults: {
        courses: 0,
        faculty: 0,
        students: 0,
        rooms: 0,
        conflicts: []
    }
};

// Current timetable view
let currentTimetableView = 'master';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    console.log('App starting...');
    setupEventListeners();
    setupDownloadEventListeners();
    updateDashboard();
    renderAllTables();
    populateTimeFilters();
    detectConflicts();
});

// Helper Functions for Downloads
function downloadCSV(csvContent, filename) {
    try {
        // Add UTF-8 BOM for Excel compatibility
        const BOM = '\uFEFF';
        const content = BOM + csvContent;
        
        const blob = new Blob([content], { 
            type: 'text/csv;charset=utf-8' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        showNotification('Download generated successfully!', 'success');
        console.log('CSV downloaded:', filename);
    } catch (error) {
        console.error('Download failed:', error);
        showNotification('Download failed: ' + error.message, 'error');
    }
}

function downloadPDF(filename, content, tableData = null) {
    try {
        // Check for jsPDF availability with multiple approaches
        let jsPDF;
        if (typeof window.jspdf !== 'undefined') {
            jsPDF = window.jspdf.jsPDF;
        } else if (typeof window.jsPDF !== 'undefined' && window.jsPDF.jsPDF) {
            jsPDF = window.jsPDF.jsPDF;
        } else if (typeof jspdf !== 'undefined') {
            jsPDF = jspdf.jsPDF;
        } else {
            throw new Error('jsPDF library not loaded');
        }
        
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.text('Presidency University - Summer Term', 20, 20);
        doc.setFontSize(12);
        doc.text(content.title || 'Timetable Report', 20, 30);
        
        let yPosition = 50;
        
        // Add text content
        if (content.text) {
            doc.setFontSize(10);
            const lines = content.text.split('\n');
            lines.forEach(line => {
                if (yPosition > 280) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, 20, yPosition);
                yPosition += 6;
            });
        }
        
        // Add table if provided and autoTable is available
        if (tableData && typeof doc.autoTable === 'function') {
            doc.autoTable({
                startY: yPosition + 10,
                head: [tableData.headers],
                body: tableData.rows,
                styles: {
                    fontSize: 8,
                    cellPadding: 2
                },
                headStyles: {
                    fillColor: [31, 128, 141],
                    textColor: 255
                }
            });
        } else if (tableData) {
            // Simple table fallback without autoTable
            yPosition += 10;
            doc.setFontSize(8);
            
            // Table headers
            let xPos = 20;
            tableData.headers.forEach((header, index) => {
                doc.text(header, xPos, yPosition);
                xPos += 25;
            });
            yPosition += 8;
            
            // Table rows
            tableData.rows.forEach(row => {
                if (yPosition > 280) {
                    doc.addPage();
                    yPosition = 20;
                }
                xPos = 20;
                row.forEach((cell, index) => {
                    doc.text(String(cell).substring(0, 15), xPos, yPosition);
                    xPos += 25;
                });
                yPosition += 6;
            });
        }
        
        doc.save(filename);
        showNotification('PDF downloaded successfully!', 'success');
        console.log('PDF downloaded:', filename);
    } catch (error) {
        console.error('PDF download failed:', error);
        showNotification('PDF download failed: ' + error.message + '. Please refresh the page and try again.', 'error');
    }
}

// Setup Download Event Listeners
function setupDownloadEventListeners() {
    console.log('Setting up download event listeners...');
    
    // Bulk template downloads
    const bulkBtn = document.getElementById('btn-download-bulk');
    const bulkBtn2 = document.getElementById('btn-download-bulk-2');
    if (bulkBtn) bulkBtn.addEventListener('click', () => downloadBulkTemplate());
    if (bulkBtn2) bulkBtn2.addEventListener('click', () => downloadBulkTemplate());
    
    // Individual template downloads
    const templateButtons = [
        { id: 'btn-download-courses-template', type: 'courses' },
        { id: 'btn-download-faculty-template', type: 'faculty' },
        { id: 'btn-download-students-template', type: 'students' },
        { id: 'btn-download-rooms-template', type: 'rooms' }
    ];
    
    templateButtons.forEach(({ id, type }) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => downloadTemplate(type));
        }
    });
    
    // Timetable export buttons
    const masterCsvBtn = document.getElementById('btn-export-master-csv');
    const masterPdfBtn = document.getElementById('btn-export-master-pdf');
    if (masterCsvBtn) masterCsvBtn.addEventListener('click', exportMasterTimetableCSV);
    if (masterPdfBtn) masterPdfBtn.addEventListener('click', exportMasterTimetablePDF);
    
    // Faculty export buttons
    const facultyCsvBtn = document.getElementById('btn-export-faculty-csv');
    const facultyPdfBtn = document.getElementById('btn-export-faculty-pdf');
    if (facultyCsvBtn) facultyCsvBtn.addEventListener('click', exportFacultyScheduleCSV);
    if (facultyPdfBtn) facultyPdfBtn.addEventListener('click', exportFacultySchedulePDF);
    
    // Room export button
    const roomCsvBtn = document.getElementById('btn-export-room-csv');
    if (roomCsvBtn) roomCsvBtn.addEventListener('click', exportRoomUtilizationCSV);
    
    // Conflicts export button
    const conflictsCsvBtn = document.getElementById('btn-export-conflicts-csv');
    if (conflictsCsvBtn) conflictsCsvBtn.addEventListener('click', exportConflictsCSV);
    
    console.log('Download event listeners setup complete');
}

// Template Download Functions
function downloadBulkTemplate() {
    downloadCSV(bulkCSVTemplate, 'bulk_import_template.csv');
}

function downloadTemplate(dataType) {
    const template = csvTemplates[dataType];
    if (template) {
        downloadCSV(template, `${dataType}_template.csv`);
    } else {
        showNotification(`Template for ${dataType} not found`, 'error');
    }
}

// Export Functions
function exportMasterTimetableCSV() {
    console.log('Exporting master timetable CSV...');
    
    if (!appData.timetable || Object.keys(appData.timetable).length === 0) {
        showNotification('No timetable data available. Please generate timetables first.', 'warning');
        return;
    }
    
    let csv = 'Day,Time,Course ID,Course Name,Faculty,Room,Students Count\n';
    
    appData.days.forEach(day => {
        appData.timeSlots.forEach(slot => {
            const slotData = appData.timetable[day] && appData.timetable[day][slot.id];
            if (slotData) {
                const courseName = getCourseNameById(slotData.courseId);
                const studentsCount = slotData.students ? slotData.students.length : 0;
                
                csv += `"${day}","${slot.label}","${slotData.courseId}","${courseName}","${slotData.faculty}","${slotData.room}",${studentsCount}\n`;
            }
        });
    });
    
    downloadCSV(csv, 'master_timetable.csv');
}

function exportMasterTimetablePDF() {
    console.log('Exporting master timetable PDF...');
    
    if (!appData.timetable || Object.keys(appData.timetable).length === 0) {
        showNotification('No timetable data available. Please generate timetables first.', 'warning');
        return;
    }
    
    const tableData = {
        headers: ['Day', 'Time', 'Course', 'Faculty', 'Room', 'Students'],
        rows: []
    };
    
    appData.days.forEach(day => {
        appData.timeSlots.forEach(slot => {
            const slotData = appData.timetable[day] && appData.timetable[day][slot.id];
            if (slotData) {
                const studentsCount = slotData.students ? slotData.students.length : 0;
                tableData.rows.push([
                    day,
                    slot.label,
                    slotData.courseId,
                    slotData.faculty,
                    slotData.room,
                    studentsCount.toString()
                ]);
            }
        });
    });
    
    const content = {
        title: 'Master Timetable',
        text: `Generated on: ${new Date().toLocaleDateString()}\nTotal scheduled sessions: ${tableData.rows.length}`
    };
    
    downloadPDF('master_timetable.pdf', content, tableData);
}

function exportFacultyScheduleCSV() {
    const facultyId = document.getElementById('faculty-select')?.value;
    if (!facultyId) {
        showNotification('Please select a faculty member first', 'warning');
        return;
    }
    
    const faculty = appData.faculty.find(f => f.id === facultyId);
    if (!faculty) {
        showNotification('Selected faculty not found', 'error');
        return;
    }
    
    console.log('Exporting faculty schedule CSV for:', faculty.name);
    
    let csv = `Faculty Schedule - ${faculty.name}\n`;
    csv += 'Day,Time,Course ID,Course Name,Room,Students Count\n';
    
    let hasSchedule = false;
    appData.days.forEach(day => {
        appData.timeSlots.forEach(slot => {
            const slotData = appData.timetable[day] && appData.timetable[day][slot.id];
            if (slotData && slotData.faculty === faculty.name) {
                hasSchedule = true;
                const courseName = getCourseNameById(slotData.courseId);
                const studentsCount = slotData.students ? slotData.students.length : 0;
                
                csv += `"${day}","${slot.label}","${slotData.courseId}","${courseName}","${slotData.room}",${studentsCount}\n`;
            }
        });
    });
    
    if (!hasSchedule) {
        csv += 'No scheduled classes found for this faculty member.\n';
    }
    
    const filename = `${faculty.name.replace(/\s+/g, '_')}_schedule.csv`;
    downloadCSV(csv, filename);
}

function exportFacultySchedulePDF() {
    const facultyId = document.getElementById('faculty-select')?.value;
    if (!facultyId) {
        showNotification('Please select a faculty member first', 'warning');
        return;
    }
    
    const faculty = appData.faculty.find(f => f.id === facultyId);
    if (!faculty) {
        showNotification('Selected faculty not found', 'error');
        return;
    }
    
    console.log('Exporting faculty schedule PDF for:', faculty.name);
    
    const tableData = {
        headers: ['Day', 'Time', 'Course', 'Room', 'Students'],
        rows: []
    };
    
    appData.days.forEach(day => {
        appData.timeSlots.forEach(slot => {
            const slotData = appData.timetable[day] && appData.timetable[day][slot.id];
            if (slotData && slotData.faculty === faculty.name) {
                const studentsCount = slotData.students ? slotData.students.length : 0;
                tableData.rows.push([
                    day,
                    slot.label,
                    slotData.courseId,
                    slotData.room,
                    studentsCount.toString()
                ]);
            }
        });
    });
    
    const content = {
        title: `${faculty.name} - Teaching Schedule`,
        text: `Faculty ID: ${faculty.id}\nGenerated on: ${new Date().toLocaleDateString()}\nTotal scheduled classes: ${tableData.rows.length}`
    };
    
    const filename = `${faculty.name.replace(/\s+/g, '_')}_schedule.pdf`;
    downloadPDF(filename, content, tableData.rows.length > 0 ? tableData : null);
}

function exportRoomUtilizationCSV() {
    console.log('Exporting room utilization CSV...');
    
    let csv = 'Room Utilization Report\n';
    csv += 'Room ID,Room Name,Capacity,Day,Time,Course,Faculty,Students Count,Utilization %\n';
    
    appData.rooms.forEach(room => {
        let roomScheduled = false;
        appData.days.forEach(day => {
            appData.timeSlots.forEach(slot => {
                const slotData = appData.timetable[day] && appData.timetable[day][slot.id];
                if (slotData && slotData.room === room.id) {
                    roomScheduled = true;
                    const studentsCount = slotData.students ? slotData.students.length : 0;
                    const utilization = room.capacity > 0 ? Math.round((studentsCount / room.capacity) * 100) : 0;
                    
                    csv += `"${room.id}","${room.name}",${room.capacity},"${day}","${slot.label}","${slotData.courseId}","${slotData.faculty}",${studentsCount},${utilization}%\n`;
                }
            });
        });
        
        if (!roomScheduled) {
            csv += `"${room.id}","${room.name}",${room.capacity},"Not Scheduled","","","",0,0%\n`;
        }
    });
    
    downloadCSV(csv, 'room_utilization_report.csv');
}

function exportConflictsCSV() {
    console.log('Exporting conflicts CSV...');
    
    let csv = 'Conflicts Report\n';
    csv += 'Type,Severity,Entity,Description,Suggested Resolution\n';
    
    if (appData.conflicts && appData.conflicts.length > 0) {
        appData.conflicts.forEach(conflict => {
            csv += `"${conflict.type}","${conflict.severity}","${conflict.entity}","${conflict.description}","${conflict.resolution}"\n`;
        });
    } else {
        csv += '"No Conflicts","INFO","System","No scheduling conflicts detected.","No action required."\n';
    }
    
    csv += `\nReport generated on: ${new Date().toLocaleDateString()}\n`;
    csv += `Total conflicts: ${appData.conflicts ? appData.conflicts.length : 0}\n`;
    
    downloadCSV(csv, 'conflicts_report.csv');
}

// Helper function to get course name by ID
function getCourseNameById(courseId) {
    const course = appData.courses.find(c => c.id === courseId);
    return course ? course.name : courseId;
}

// Global functions for HTML onclick handlers
window.openImportModal = function(dataType) {
    console.log('Opening import modal for:', dataType);
    
    const modal = document.getElementById('import-modal');
    const title = document.getElementById('import-modal-title');
    
    if (modal && title) {
        importState.dataType = dataType;
        importState.currentStep = 0;
        title.textContent = `Import ${dataType.charAt(0).toUpperCase() + dataType.slice(1)} Data`;
        modal.classList.remove('hidden');
        showImportStep(0);
    }
};

window.openBulkImportModal = function() {
    console.log('Opening bulk import modal');
    
    const modal = document.getElementById('bulk-import-modal');
    if (modal) {
        bulkImportState = {
            csvData: null,
            parsedData: [],
            importResults: {
                courses: 0,
                faculty: 0,
                students: 0,
                rooms: 0,
                conflicts: []
            }
        };
        modal.classList.remove('hidden');
        document.getElementById('bulk-import-results').style.display = 'none';
        document.getElementById('process-bulk-import').style.display = 'none';
    }
};

window.deleteItem = function(type, index) {
    if (confirm('Are you sure you want to delete this item?')) {
        appData[type].splice(index, 1);
        updateDashboard();
        renderTable(type);
        detectConflicts();
        showNotification('Item deleted!', 'success');
    }
};

window.editSlot = function(day, time) {
    console.log('Edit slot:', day, time);
    showNotification('Slot editing functionality - please regenerate timetable to make changes', 'info');
};

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Tab clicked:', this.dataset.tab);
            switchTab(this.dataset.tab);
        });
    });

    // Load sample data
    const loadBtn = document.getElementById('load-sample-data');
    if (loadBtn) {
        loadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Load sample data clicked');
            loadSampleData();
        });
    }

    // Generate timetable
    const genBtn = document.getElementById('generate-timetable');
    if (genBtn) {
        genBtn.addEventListener('click', function(e) {
            e.preventDefault();
            generateTimetable();
        });
    }

    // Regenerate timetable
    const regenBtn = document.getElementById('regenerate-timetable');
    if (regenBtn) {
        regenBtn.addEventListener('click', function(e) {
            e.preventDefault();
            generateTimetable();
        });
    }

    // Import modal events
    setupImportModalEvents();
    setupBulkImportEvents();

    // Timetable view switching
    setupTimetableViewEvents();

    // Conflict detection
    const detectBtn = document.getElementById('detect-conflicts');
    if (detectBtn) {
        detectBtn.addEventListener('click', detectConflicts);
    }

    console.log('Event listeners setup complete');
}

function setupBulkImportEvents() {
    const modal = document.getElementById('bulk-import-modal');
    const closeBtn = document.getElementById('bulk-import-close');
    const overlay = document.getElementById('bulk-import-overlay');
    const cancelBtn = document.getElementById('cancel-bulk-import');
    const processBtn = document.getElementById('process-bulk-import');
    const fileInput = document.getElementById('bulk-csv-input');

    if (closeBtn) closeBtn.addEventListener('click', closeBulkImportModal);
    if (overlay) overlay.addEventListener('click', closeBulkImportModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeBulkImportModal);
    if (processBtn) processBtn.addEventListener('click', processBulkImport);
    if (fileInput) fileInput.addEventListener('change', handleBulkFileSelect);

    // Drag and drop
    const uploadZone = document.getElementById('bulk-upload-zone');
    if (uploadZone) {
        uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleBulkFile(files[0]);
            }
        });

        uploadZone.addEventListener('click', function() {
            fileInput.click();
        });
    }
}

function setupTimetableViewEvents() {
    // View buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            switchTimetableView(view);
        });
    });

    // Faculty selector
    const facultySelect = document.getElementById('faculty-select');
    if (facultySelect) {
        facultySelect.addEventListener('change', function() {
            renderFacultyTimetable(this.value);
        });
    }

    // Room search
    const roomSearch = document.getElementById('room-search');
    const timeFilter = document.getElementById('time-filter');
    const dayFilter = document.getElementById('day-filter');

    if (roomSearch) {
        roomSearch.addEventListener('input', renderRoomSearch);
    }
    if (timeFilter) {
        timeFilter.addEventListener('change', renderRoomSearch);
    }
    if (dayFilter) {
        dayFilter.addEventListener('change', renderRoomSearch);
    }
}

function setupImportModalEvents() {
    const modal = document.getElementById('import-modal');
    const closeBtn = document.getElementById('import-modal-close');
    const overlay = document.getElementById('import-modal-overlay');
    const cancelBtn = document.getElementById('cancel-import');
    const nextBtn = document.getElementById('next-step');
    const prevBtn = document.getElementById('prev-step');
    const importBtn = document.getElementById('import-data');
    const fileInput = document.getElementById('csv-file-input');

    if (closeBtn) closeBtn.addEventListener('click', closeImportModal);
    if (overlay) overlay.addEventListener('click', closeImportModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeImportModal);
    if (nextBtn) nextBtn.addEventListener('click', nextImportStep);
    if (prevBtn) prevBtn.addEventListener('click', prevImportStep);
    if (importBtn) importBtn.addEventListener('click', executeImport);
    if (fileInput) fileInput.addEventListener('change', handleFileSelect);
}

function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const targetTab = document.getElementById(tabName);
    const navTab = document.querySelector(`[data-tab="${tabName}"]`);
    
    if (targetTab) {
        targetTab.classList.add('active');
        console.log('Tab content shown:', tabName);
    } else {
        console.log('Tab content not found:', tabName);
    }
    
    if (navTab) {
        navTab.classList.add('active');
        console.log('Nav tab activated:', tabName);
    } else {
        console.log('Nav tab not found:', tabName);
    }
    
    // Update table data if needed
    if (['courses', 'faculty', 'students', 'rooms'].includes(tabName)) {
        renderTable(tabName);
    }

    // Update faculty selector when switching to timetables
    if (tabName === 'timetable') {
        updateFacultySelector();
        populateTimeFilters();
        // Ensure the active timetable view is displayed
        switchTimetableView(currentTimetableView);
    }

    // Update conflicts when switching to conflicts tab
    if (tabName === 'conflicts') {
        renderConflicts();
    }
}

function switchTimetableView(view) {
    currentTimetableView = view;
    console.log('Switching timetable view to:', view);
    
    // Update view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-view="${view}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Show/hide views
    document.querySelectorAll('.timetable-view').forEach(v => {
        v.classList.remove('active');
    });
    const activeView = document.getElementById(`${view}-view`);
    if (activeView) {
        activeView.classList.add('active');
    }
    
    // Render appropriate content
    if (view === 'rooms') {
        renderRoomSearch();
    } else if (view === 'faculty') {
        updateFacultySelector();
        // Reset faculty selection and display
        const facultySelect = document.getElementById('faculty-select');
        if (facultySelect) {
            facultySelect.value = '';
            renderFacultyTimetable('');
        }
    }
}

function updateDashboard() {
    console.log('Updating dashboard...');
    
    const counts = {
        'courses-count': appData.courses.length,
        'faculty-count': appData.faculty.length,
        'students-count': appData.students.length,
        'rooms-count': appData.rooms.length,
        'conflicts-count': appData.conflicts.length
    };
    
    console.log('Dashboard counts:', counts);
    
    Object.entries(counts).forEach(([id, count]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = count;
            console.log(`Updated ${id} to ${count}`);
        } else {
            console.log(`Element not found: ${id}`);
        }
    });
    
    // Update conflict badge
    const badge = document.getElementById('conflict-badge');
    if (badge) {
        if (appData.conflicts.length > 0) {
            badge.textContent = appData.conflicts.length;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
    
    // Enable/disable generate button
    const genBtn = document.getElementById('generate-timetable');
    if (genBtn) {
        const hasData = counts['courses-count'] > 0 && counts['faculty-count'] > 0 && 
                       counts['students-count'] > 0 && counts['rooms-count'] > 0;
        genBtn.disabled = !hasData;
        console.log('Generate button enabled:', hasData);
    }
}

function loadSampleData() {
    console.log('Loading sample data...');
    
    try {
        // Deep copy sample data to avoid reference issues
        appData.courses = JSON.parse(JSON.stringify(sampleData.courses));
        appData.faculty = JSON.parse(JSON.stringify(sampleData.faculty));
        appData.students = JSON.parse(JSON.stringify(sampleData.students));
        appData.rooms = JSON.parse(JSON.stringify(sampleData.rooms));
        
        console.log('Sample data loaded:', {
            courses: appData.courses.length,
            faculty: appData.faculty.length,
            students: appData.students.length,
            rooms: appData.rooms.length
        });
        
        updateDashboard();
        renderAllTables();
        detectConflicts();
        showNotification('Sample data loaded successfully!', 'success');
    } catch (error) {
        console.error('Error loading sample data:', error);
        showNotification('Error loading sample data', 'error');
    }
}

function renderAllTables() {
    console.log('Rendering all tables...');
    ['courses', 'faculty', 'students', 'rooms'].forEach(type => {
        renderTable(type);
    });
}

function renderTable(type) {
    const container = document.getElementById(`${type}-table`);
    if (!container) {
        console.log(`Table container not found: ${type}-table`);
        return;
    }
    
    const data = appData[type];
    console.log(`Rendering ${type} table with ${data ? data.length : 0} items`);
    
    if (!data || data.length === 0) {
        container.innerHTML = '<p>No data available. Load sample data or import CSV files to get started.</p>';
        return;
    }
    
    let html = '<table><thead><tr>';
    
    // Table headers
    switch (type) {
        case 'courses':
            html += '<th>Course ID</th><th>Course Name</th><th>Sessions/Week</th><th>Faculty</th><th>Students</th><th>Actions</th>';
            break;
        case 'faculty':
            html += '<th>Faculty ID</th><th>Name</th><th>Courses</th><th>Available Slots</th><th>Actions</th>';
            break;
        case 'students':
            html += '<th>Student ID</th><th>Name</th><th>Enrolled Courses</th><th>Actions</th>';
            break;
        case 'rooms':
            html += '<th>Room ID</th><th>Name</th><th>Capacity</th><th>Available Slots</th><th>Actions</th>';
            break;
    }
    
    html += '</tr></thead><tbody>';
    
    // Table rows
    data.forEach((item, index) => {
        html += '<tr>';
        
        switch (type) {
            case 'courses':
                html += `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.sessionsPerWeek}</td>
                    <td>${item.faculty}</td>
                    <td>${item.students ? item.students.length : 0} students</td>
                    <td><button class="btn btn--sm btn--outline" onclick="deleteItem('${type}', ${index})">Delete</button></td>
                `;
                break;
            case 'faculty':
                html += `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.courses ? item.courses.join(', ') : 'None'}</td>
                    <td>${item.availability ? item.availability.length : 0} slots</td>
                    <td><button class="btn btn--sm btn--outline" onclick="deleteItem('${type}', ${index})">Delete</button></td>
                `;
                break;
            case 'students':
                html += `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.courses ? item.courses.join(', ') : 'None'}</td>
                    <td><button class="btn btn--sm btn--outline" onclick="deleteItem('${type}', ${index})">Delete</button></td>
                `;
                break;
            case 'rooms':
                html += `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.capacity}</td>
                    <td>${item.availability ? item.availability.length : 0} slots</td>
                    <td><button class="btn btn--sm btn--outline" onclick="deleteItem('${type}', ${index})">Delete</button></td>
                `;
                break;
        }
        
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
    console.log(`Table ${type} rendered successfully`);
}

// Bulk Import Functions
function handleBulkFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handleBulkFile(file);
    }
}

function handleBulkFile(file) {
    if (!file.name.toLowerCase().endsWith('.csv')) {
        showNotification('Please select a valid CSV file', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        bulkImportState.csvData = e.target.result;
        showBulkFileInfo(file);
        parseBulkCSV();
    };
    reader.readAsText(file);
}

function showBulkFileInfo(file) {
    const fileInfo = document.getElementById('bulk-file-info');
    const fileName = document.getElementById('bulk-file-name');
    const fileSize = document.getElementById('bulk-file-size');
    
    if (fileInfo && fileName && fileSize) {
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.style.display = 'block';
    }
}

function parseBulkCSV() {
    if (!bulkImportState.csvData || typeof Papa === 'undefined') {
        showNotification('CSV parser not available. Please refresh the page.', 'error');
        return;
    }
    
    Papa.parse(bulkImportState.csvData, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            bulkImportState.parsedData = results.data;
            processBulkData();
        },
        error: function(error) {
            showNotification('Error parsing CSV: ' + error.message, 'error');
        }
    });
}

function processBulkData() {
    const results = {
        courses: 0,
        faculty: 0,
        students: 0,
        rooms: 0,
        conflicts: []
    };
    
    const tempData = {
        courses: [],
        faculty: [],
        students: [],
        rooms: []
    };
    
    bulkImportState.parsedData.forEach((row, index) => {
        const type = row.TYPE ? row.TYPE.toLowerCase() : '';
        
        try {
            switch (type) {
                case 'course':
                    if (row.ID && row.Name) {
                        tempData.courses.push({
                            id: row.ID,
                            name: row.Name,
                            sessionsPerWeek: parseInt(row.Field1) || 2,
                            faculty: row.Field2 || 'Unknown',
                            students: row.Field3 ? row.Field3.split(',').map(s => s.trim()) : []
                        });
                        results.courses++;
                    }
                    break;
                    
                case 'faculty':
                    if (row.ID && row.Name) {
                        tempData.faculty.push({
                            id: row.ID,
                            name: row.Name,
                            courses: row.Field1 ? [row.Field1] : [],
                            availability: row.Field2 ? row.Field2.split(',').map(s => s.trim()) : []
                        });
                        results.faculty++;
                    }
                    break;
                    
                case 'student':
                    if (row.ID && row.Name) {
                        tempData.students.push({
                            id: row.ID,
                            name: row.Name,
                            courses: row.Field1 ? row.Field1.split(',').map(s => s.trim()) : []
                        });
                        results.students++;
                    }
                    break;
                    
                case 'room':
                    if (row.ID && row.Name) {
                        tempData.rooms.push({
                            id: row.ID,
                            name: row.Name,
                            capacity: parseInt(row.Field1) || 30,
                            availability: row.Field2 ? row.Field2.split(',').map(s => s.trim()) : []
                        });
                        results.rooms++;
                    }
                    break;
            }
        } catch (error) {
            results.conflicts.push({
                row: index + 1,
                type: 'DATA_INTEGRITY',
                description: `Error processing ${type} data: ${error.message}`
            });
        }
    });
    
    bulkImportState.importResults = results;
    bulkImportState.tempData = tempData;
    
    showBulkImportResults();
}

function showBulkImportResults() {
    const results = bulkImportState.importResults;
    
    document.getElementById('courses-imported').textContent = results.courses;
    document.getElementById('faculty-imported').textContent = results.faculty;
    document.getElementById('students-imported').textContent = results.students;
    document.getElementById('rooms-imported').textContent = results.rooms;
    document.getElementById('conflicts-detected').textContent = results.conflicts.length;
    
    // Show conflicts if any
    const conflictsContainer = document.getElementById('import-conflicts');
    const conflictsList = document.getElementById('import-conflicts-list');
    
    if (results.conflicts.length > 0) {
        let conflictsHtml = '';
        results.conflicts.forEach(conflict => {
            conflictsHtml += `<div class="conflict-item"><p>Row ${conflict.row}: ${conflict.description}</p></div>`;
        });
        conflictsList.innerHTML = conflictsHtml;
        conflictsContainer.style.display = 'block';
    } else {
        conflictsContainer.style.display = 'none';
    }
    
    document.getElementById('bulk-import-results').style.display = 'block';
    document.getElementById('process-bulk-import').style.display = 'inline-block';
}

function processBulkImport() {
    const tempData = bulkImportState.tempData;
    
    // Merge with existing data
    Object.keys(tempData).forEach(type => {
        tempData[type].forEach(item => {
            const exists = appData[type].some(existing => existing.id === item.id);
            if (!exists) {
                appData[type].push(item);
            }
        });
    });
    
    closeBulkImportModal();
    updateDashboard();
    renderAllTables();
    detectConflicts();
    
    const total = Object.values(bulkImportState.importResults).slice(0, 4).reduce((sum, count) => sum + count, 0);
    showNotification(`Bulk import completed! ${total} records imported`, 'success');
}

function closeBulkImportModal() {
    const modal = document.getElementById('bulk-import-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    
    // Reset state
    bulkImportState = {
        csvData: null,
        parsedData: [],
        importResults: {
            courses: 0,
            faculty: 0,
            students: 0,
            rooms: 0,
            conflicts: []
        }
    };
    
    const fileInfo = document.getElementById('bulk-file-info');
    const results = document.getElementById('bulk-import-results');
    const processBtn = document.getElementById('process-bulk-import');
    
    if (fileInfo) fileInfo.style.display = 'none';
    if (results) results.style.display = 'none';
    if (processBtn) processBtn.style.display = 'none';
}

// Conflict Detection
function detectConflicts() {
    console.log('Detecting conflicts...');
    appData.conflicts = [];
    
    // Student double-booking conflicts
    appData.students.forEach(student => {
        const enrolledCourses = student.courses || [];
        const courseSchedules = [];
        
        enrolledCourses.forEach(courseId => {
            const course = appData.courses.find(c => c.id === courseId);
            if (course) {
                const faculty = appData.faculty.find(f => f.name === course.faculty);
                if (faculty && faculty.availability) {
                    courseSchedules.push({
                        courseId: courseId,
                        courseName: course.name,
                        schedule: faculty.availability
                    });
                }
            }
        });
        
        // Check for overlapping schedules
        for (let i = 0; i < courseSchedules.length; i++) {
            for (let j = i + 1; j < courseSchedules.length; j++) {
                const overlap = courseSchedules[i].schedule.some(slot => 
                    courseSchedules[j].schedule.includes(slot)
                );
                
                if (overlap) {
                    appData.conflicts.push({
                        type: 'STUDENT_DOUBLE_BOOKING',
                        severity: 'HIGH',
                        entity: student.id,
                        description: `Student ${student.name} is enrolled in ${courseSchedules[i].courseName} and ${courseSchedules[j].courseName} which have overlapping schedules`,
                        resolution: 'Adjust course schedules or drop one course for this student'
                    });
                }
            }
        }
    });
    
    // Faculty double-booking conflicts
    const facultySchedules = {};
    appData.courses.forEach(course => {
        const faculty = appData.faculty.find(f => f.name === course.faculty);
        if (faculty && faculty.availability) {
            if (!facultySchedules[faculty.name]) {
                facultySchedules[faculty.name] = [];
            }
            
            faculty.availability.forEach(slot => {
                if (facultySchedules[faculty.name].includes(slot)) {
                    appData.conflicts.push({
                        type: 'FACULTY_DOUBLE_BOOKING',
                        severity: 'HIGH',
                        entity: faculty.id,
                        description: `Faculty ${faculty.name} has conflicting schedules at ${slot}`,
                        resolution: 'Adjust faculty availability or course scheduling'
                    });
                } else {
                    facultySchedules[faculty.name].push(slot);
                }
            });
        }
    });
    
    // Room capacity violations
    appData.courses.forEach(course => {
        const studentCount = course.students ? course.students.length : 0;
        const availableRooms = appData.rooms.filter(room => room.capacity >= studentCount);
        
        if (availableRooms.length === 0) {
            appData.conflicts.push({
                type: 'CAPACITY_VIOLATION',
                severity: 'MEDIUM',
                entity: course.id,
                description: `Course ${course.name} has ${studentCount} students but no room with sufficient capacity is available`,
                resolution: 'Move to a larger room or split course into multiple sessions'
            });
        }
    });
    
    // Missing dependencies
    appData.courses.forEach(course => {
        const faculty = appData.faculty.find(f => f.name === course.faculty);
        if (!faculty) {
            appData.conflicts.push({
                type: 'MISSING_DEPENDENCY',
                severity: 'HIGH',
                entity: course.id,
                description: `Course ${course.name} references faculty "${course.faculty}" which does not exist`,
                resolution: 'Add the faculty member or reassign the course to an existing faculty'
            });
        }
    });
    
    console.log(`Conflicts detected: ${appData.conflicts.length}`);
    updateDashboard();
    renderConflicts();
}

function renderConflicts() {
    const conflictsList = document.getElementById('conflicts-list');
    if (!conflictsList) return;
    
    console.log('Rendering conflicts...');
    
    // Update statistics
    const totalConflicts = appData.conflicts.length;
    const highConflicts = appData.conflicts.filter(c => c.severity === 'HIGH').length;
    const mediumConflicts = appData.conflicts.filter(c => c.severity === 'MEDIUM').length;
    
    const totalEl = document.getElementById('total-conflicts');
    const highEl = document.getElementById('high-conflicts');
    const mediumEl = document.getElementById('medium-conflicts');
    
    if (totalEl) totalEl.textContent = totalConflicts;
    if (highEl) highEl.textContent = highConflicts;
    if (mediumEl) mediumEl.textContent = mediumConflicts;
    
    if (totalConflicts === 0) {
        conflictsList.innerHTML = `
            <div class="card">
                <div class="card__body">
                    <p class="no-conflicts">✅ No conflicts detected! Your scheduling data is consistent.</p>
                </div>
            </div>
        `;
        return;
    }
    
    let html = '<div class="card"><div class="card__body"><h3>Detected Conflicts</h3>';
    
    appData.conflicts.forEach((conflict, index) => {
        const severity = conflict.severity.toLowerCase();
        html += `
            <div class="conflict-item ${severity === 'medium' ? 'warning' : ''}">
                <h4>${conflict.type.replace(/_/g, ' ')}</h4>
                <p><strong>Entity:</strong> ${conflict.entity}</p>
                <p><strong>Issue:</strong> ${conflict.description}</p>
                <div class="conflict-resolution">
                    <strong>Suggested Resolution:</strong> ${conflict.resolution}
                </div>
            </div>
        `;
    });
    
    html += '</div></div>';
    conflictsList.innerHTML = html;
}

// Timetable Generation
async function generateTimetable() {
    console.log('Generating timetables...');
    
    showGenerationProgress();
    
    // Initialize timetable structure
    appData.timetable = {};
    appData.days.forEach(day => {
        appData.timetable[day] = {};
        appData.timeSlots.forEach(slot => {
            appData.timetable[day][slot.id] = null;
        });
    });
    
    await delay(500);
    updateProgress(30, 'Processing courses...');
    
    // Create scheduling requirements
    const requirements = [];
    appData.courses.forEach(course => {
        for (let i = 0; i < course.sessionsPerWeek; i++) {
            requirements.push({
                courseId: course.id,
                courseName: course.name,
                faculty: course.faculty,
                students: course.students || [],
                sessionNumber: i + 1
            });
        }
    });
    
    await delay(500);
    updateProgress(60, 'Assigning time slots...');
    
    // Simple scheduling algorithm
    const scheduled = [];
    const conflicts = [];
    
    for (const req of requirements) {
        const assignment = findValidSlot(req, scheduled);
        if (assignment) {
            scheduled.push({...req, ...assignment});
            appData.timetable[assignment.day][assignment.time] = {
                courseId: req.courseId,
                courseName: req.courseName,
                faculty: req.faculty,
                room: assignment.room,
                students: req.students
            };
        } else {
            conflicts.push(req);
        }
    }
    
    await delay(500);
    updateProgress(100, 'Complete!');
    
    await delay(500);
    hideGenerationProgress();
    renderTimetable();
    updateFacultySelector();
    renderRoomSearch();
    
    if (conflicts.length > 0) {
        showNotification(`Timetables generated with ${conflicts.length} conflicts`, 'warning');
    } else {
        showNotification('Timetables generated successfully!', 'success');
    }
    
    switchTab('timetable');
}

function findValidSlot(requirement, scheduled) {
    // Find faculty availability
    const faculty = appData.faculty.find(f => f.name === requirement.faculty);
    if (!faculty || !faculty.availability) {
        // Use default availability if faculty not found
        const defaultSlots = ['Mon-9', 'Tue-10', 'Wed-11', 'Thu-14', 'Fri-15'];
        faculty.availability = defaultSlots;
    }
    
    for (const slot of faculty.availability) {
        const [dayAbbr, time] = slot.split('-');
        const day = getDayName(dayAbbr);
        
        if (!day || !appData.timetable[day] || appData.timetable[day][time]) continue;
        
        // Check conflicts
        const hasConflict = scheduled.some(s => 
            s.faculty === requirement.faculty && s.day === day && s.time === time
        );
        
        if (hasConflict) continue;
        
        // Find available room
        const room = findAvailableRoom(day, time, requirement.students.length);
        if (!room) continue;
        
        return {
            day: day,
            time: time,
            room: room.id
        };
    }
    
    return null;
}

function getDayName(abbr) {
    const map = {
        'Mon': 'Monday',
        'Tue': 'Tuesday',
        'Wed': 'Wednesday',
        'Thu': 'Thursday',
        'Fri': 'Friday'
    };
    return map[abbr];
}

function findAvailableRoom(day, time, capacity) {
    const slot = `${day.substr(0,3)}-${time}`;
    
    return appData.rooms.find(room => 
        room.capacity >= capacity && 
        (!room.availability || room.availability.includes(slot)) &&
        !isRoomOccupied(room.id, day, time)
    ) || appData.rooms[0]; // Fallback to first room
}

function isRoomOccupied(roomId, day, time) {
    const slot = appData.timetable[day] && appData.timetable[day][time];
    return slot && slot.room === roomId;
}

function renderTimetable() {
    const container = document.getElementById('timetable-grid');
    if (!container) return;
    
    let html = '<table class="timetable-table"><thead><tr>';
    html += '<th class="time-header">Time</th>';
    
    appData.days.forEach(day => {
        html += `<th>${day}</th>`;
    });
    
    html += '</tr></thead><tbody>';
    
    appData.timeSlots.forEach(slot => {
        html += '<tr>';
        html += `<td class="time-header">${slot.label}</td>`;
        
        appData.days.forEach(day => {
            const slotData = appData.timetable[day] && appData.timetable[day][slot.id];
            
            if (slotData) {
                html += `
                    <td class="timetable-slot occupied" onclick="editSlot('${day}', '${slot.id}')">
                        <div class="slot-content">
                            <div class="slot-course">${slotData.courseId}</div>
                            <div class="slot-faculty">${slotData.faculty}</div>
                            <div class="slot-room">${slotData.room}</div>
                            <div class="slot-students">${slotData.students ? slotData.students.length : 0} students</div>
                        </div>
                    </td>
                `;
            } else {
                html += `
                    <td class="timetable-slot" onclick="editSlot('${day}', '${slot.id}')">
                        <div class="slot-content">Empty</div>
                    </td>
                `;
            }
        });
        
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Faculty Timetable Functions
function updateFacultySelector() {
    const select = document.getElementById('faculty-select');
    if (!select) return;
    
    // Clear existing options
    select.innerHTML = '<option value="">Choose a faculty member</option>';
    
    appData.faculty.forEach(faculty => {
        const option = document.createElement('option');
        option.value = faculty.id;
        option.textContent = faculty.name;
        select.appendChild(option);
    });
    
    console.log(`Faculty selector updated with ${appData.faculty.length} faculty members`);
}

function renderFacultyTimetable(facultyId) {
    const container = document.getElementById('faculty-timetable-grid');
    const title = document.getElementById('faculty-timetable-title');
    if (!container || !title) return;
    
    if (!facultyId) {
        title.textContent = 'Select a faculty member to view their schedule';
        container.innerHTML = '';
        return;
    }
    
    const faculty = appData.faculty.find(f => f.id === facultyId);
    if (!faculty) return;
    
    title.textContent = `${faculty.name} - Schedule`;
    
    // Build faculty-specific timetable
    let html = '<table class="timetable-table"><thead><tr>';
    html += '<th class="time-header">Time</th>';
    
    appData.days.forEach(day => {
        html += `<th>${day}</th>`;
    });
    
    html += '</tr></thead><tbody>';
    
    appData.timeSlots.forEach(slot => {
        html += '<tr>';
        html += `<td class="time-header">${slot.label}</td>`;
        
        appData.days.forEach(day => {
            const slotData = appData.timetable[day] && appData.timetable[day][slot.id];
            
            if (slotData && slotData.faculty === faculty.name) {
                html += `
                    <td class="timetable-slot occupied">
                        <div class="slot-content">
                            <div class="slot-course">${slotData.courseId}</div>
                            <div class="slot-room">${slotData.room}</div>
                            <div class="slot-students">${slotData.students ? slotData.students.length : 0} students</div>
                        </div>
                    </td>
                `;
            } else {
                html += `<td class="timetable-slot"><div class="slot-content">Free</div></td>`;
            }
        });
        
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Room Search Functions
function populateTimeFilters() {
    const timeFilter = document.getElementById('time-filter');
    if (!timeFilter) return;
    
    timeFilter.innerHTML = '<option value="">All times</option>';
    
    appData.timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.id;
        option.textContent = slot.label;
        timeFilter.appendChild(option);
    });
}

function renderRoomSearch() {
    const container = document.getElementById('room-grid');
    if (!container) return;
    
    const searchInput = document.getElementById('room-search');
    const timeFilter = document.getElementById('time-filter');
    const dayFilter = document.getElementById('day-filter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const timeFilterValue = timeFilter ? timeFilter.value : '';
    const dayFilterValue = dayFilter ? dayFilter.value : '';
    
    let filteredRooms = appData.rooms;
    
    // Apply search filter
    if (searchTerm) {
        filteredRooms = filteredRooms.filter(room => 
            room.name.toLowerCase().includes(searchTerm) ||
            room.id.toLowerCase().includes(searchTerm)
        );
    }
    
    let html = '';
    
    filteredRooms.forEach(room => {
        html += `
            <div class="room-card">
                <div class="room-header">
                    <h4>${room.name} (${room.id})</h4>
                    <div class="room-capacity">Capacity: ${room.capacity} students</div>
                </div>
                <div class="room-schedule">
        `;
        
        // Show room schedule
        const daysToShow = dayFilterValue ? [dayFilterValue] : appData.days;
        const timesToShow = timeFilterValue ? [timeFilterValue] : appData.timeSlots.map(s => s.id);
        
        daysToShow.forEach(day => {
            timesToShow.forEach(timeId => {
                const timeSlot = appData.timeSlots.find(s => s.id === timeId);
                if (!timeSlot) return;
                
                const slotData = appData.timetable[day] && appData.timetable[day][timeId];
                const isOccupiedByThisRoom = slotData && slotData.room === room.id;
                
                html += `
                    <div class="room-slot">
                        <span class="slot-time">${day} ${timeSlot.label}</span>
                        <span class="${isOccupiedByThisRoom ? 'slot-course' : 'slot-empty'}">
                            ${isOccupiedByThisRoom ? `${slotData.courseId} (${slotData.faculty})` : 'Available'}
                        </span>
                    </div>
                `;
            });
        });
        
        html += '</div></div>';
    });
    
    if (html === '') {
        html = '<p>No rooms found matching your search criteria.</p>';
    }
    
    container.innerHTML = html;
}

// Import Modal Functions (existing functionality)
function closeImportModal() {
    const modal = document.getElementById('import-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    resetImportState();
}

function resetImportState() {
    importState = {
        currentStep: 0,
        dataType: '',
        csvData: null,
        parsedData: [],
        validData: [],
        errors: []
    };
}

function showImportStep(step) {
    document.querySelectorAll('.import-step').forEach(s => s.classList.remove('active'));
    const stepElement = document.querySelectorAll('.import-step')[step];
    if (stepElement) {
        stepElement.classList.add('active');
    }
    
    const nextBtn = document.getElementById('next-step');
    const prevBtn = document.getElementById('prev-step');
    const importBtn = document.getElementById('import-data');
    
    if (nextBtn) nextBtn.style.display = step < 2 ? 'inline-block' : 'none';
    if (prevBtn) prevBtn.style.display = step > 0 ? 'inline-block' : 'none';
    if (importBtn) importBtn.style.display = step === 2 ? 'inline-block' : 'none';
    
    importState.currentStep = step;
}

function nextImportStep() {
    if (importState.currentStep === 0 && !importState.csvData) {
        showNotification('Please select a CSV file first', 'error');
        return;
    }
    
    if (importState.currentStep === 0) {
        parseCSVData();
    }
    
    if (importState.currentStep < 2) {
        showImportStep(importState.currentStep + 1);
    }
}

function prevImportStep() {
    if (importState.currentStep > 0) {
        showImportStep(importState.currentStep - 1);
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
        showNotification('Please select a valid CSV file', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        importState.csvData = e.target.result;
        showFileInfo(file);
    };
    reader.readAsText(file);
}

function showFileInfo(file) {
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    
    if (fileInfo && fileName && fileSize) {
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.style.display = 'block';
    }
}

function parseCSVData() {
    if (!importState.csvData) return;
    
    if (typeof Papa === 'undefined') {
        showNotification('CSV parser not available. Please refresh the page.', 'error');
        return;
    }
    
    Papa.parse(importState.csvData, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            importState.parsedData = results.data;
            validateCSVData();
            showDataPreview();
        },
        error: function(error) {
            showNotification('Error parsing CSV: ' + error.message, 'error');
        }
    });
}

function validateCSVData() {
    importState.validData = [];
    importState.errors = [];
    
    importState.parsedData.forEach((row, index) => {
        let isValid = true;
        const errors = [];
        
        if (importState.dataType === 'courses') {
            if (!row.course_id) { errors.push('Missing course_id'); isValid = false; }
            if (!row.course_name) { errors.push('Missing course_name'); isValid = false; }
            if (!row.sessions_per_week) { errors.push('Missing sessions_per_week'); isValid = false; }
            if (!row.faculty_name) { errors.push('Missing faculty_name'); isValid = false; }
        }
        
        if (isValid) {
            let item = {};
            if (importState.dataType === 'courses') {
                item = {
                    id: row.course_id,
                    name: row.course_name,
                    sessionsPerWeek: parseInt(row.sessions_per_week) || 1,
                    faculty: row.faculty_name,
                    students: row.enrolled_students ? row.enrolled_students.split(',').map(s => s.trim()) : []
                };
            } else if (importState.dataType === 'faculty') {
                item = {
                    id: row.faculty_id || 'F' + Date.now(),
                    name: row.faculty_name || 'Unknown',
                    courses: row.available_courses ? row.available_courses.split(',').map(s => s.trim()) : [],
                    availability: row.availability_slots ? row.availability_slots.split(',').map(s => s.trim()) : []
                };
            } else if (importState.dataType === 'students') {
                item = {
                    id: row.student_id || 'S' + Date.now(),
                    name: row.student_name || 'Unknown',
                    courses: row.enrolled_courses ? row.enrolled_courses.split(',').map(s => s.trim()) : []
                };
            } else if (importState.dataType === 'rooms') {
                item = {
                    id: row.room_id || 'R' + Date.now(),
                    name: row.room_name || 'Unknown',
                    capacity: parseInt(row.capacity) || 20,
                    availability: row.available_slots ? row.available_slots.split(',').map(s => s.trim()) : []
                };
            }
            importState.validData.push(item);
        } else {
            importState.errors.push({
                row: index + 1,
                errors: errors
            });
        }
    });
}

function showDataPreview() {
    const totalRows = document.getElementById('total-rows');
    const validRows = document.getElementById('valid-rows');
    const errorRows = document.getElementById('error-rows');
    const previewTable = document.getElementById('preview-table');
    
    if (totalRows) totalRows.textContent = `${importState.parsedData.length} rows found`;
    if (validRows) validRows.textContent = `${importState.validData.length} valid`;
    if (errorRows) errorRows.textContent = `${importState.errors.length} errors`;
    
    if (previewTable && importState.parsedData.length > 0) {
        const headers = Object.keys(importState.parsedData[0]);
        let html = '<table><thead><tr>';
        headers.forEach(header => {
            html += `<th>${header}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        importState.parsedData.slice(0, 5).forEach(row => {
            html += '<tr>';
            headers.forEach(header => {
                html += `<td>${row[header] || ''}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        previewTable.innerHTML = html;
    }
}

function executeImport() {
    if (importState.validData.length === 0) {
        showNotification('No valid data to import', 'error');
        return;
    }
    
    importState.validData.forEach(item => {
        const exists = appData[importState.dataType].some(existing => existing.id === item.id);
        if (!exists) {
            appData[importState.dataType].push(item);
        }
    });
    
    closeImportModal();
    updateDashboard();
    renderAllTables();
    detectConflicts();
    showNotification(`Import completed! ${importState.validData.length} records imported`, 'success');
}

// Progress and Status Functions
function showGenerationProgress() {
    const status = document.getElementById('generation-status');
    const container = document.getElementById('master-view');
    if (status) status.style.display = 'block';
    if (container) container.style.display = 'none';
}

function hideGenerationProgress() {
    const status = document.getElementById('generation-status');
    const container = document.getElementById('master-view');
    if (status) status.style.display = 'none';
    if (container) container.style.display = 'block';
}

function updateProgress(percentage, text) {
    const fill = document.getElementById('progress-fill');
    const textEl = document.getElementById('progress-text');
    if (fill) fill.style.width = `${percentage}%`;
    if (textEl) textEl.textContent = text;
}

// Utility Functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showNotification(message, type) {
    console.log('Notification:', type, message);
    
    const notification = document.createElement('div');
    notification.className = `status status--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 12px 16px;
        border-radius: 8px;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 4000);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}