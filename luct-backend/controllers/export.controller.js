const ExcelJS = require('exceljs');
const pool = require('../config/db');

const exportReports = async (req, res) => {
  try {
    const [reports] = await pool.execute(
      `SELECT 
        lr.date_of_lecture,
        lr.week_of_reporting,
        co.course_name,
        co.course_code,
        c.class_name,
        u.name AS lecturer,
        c.venue,
        c.scheduled_time,
        lr.topic_taught,
        lr.actual_students_present,
        c.total_registered_students,
        lr.prl_feedback
       FROM lecture_reports lr
       JOIN classes c ON lr.class_id = c.id
       JOIN courses co ON c.course_id = co.id
       JOIN users u ON c.lecturer_id = u.id
       WHERE co.faculty = ?`,
      [req.user.faculty]
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Lecture Reports');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Week', key: 'week', width: 15 },
      { header: 'Course Name', key: 'course', width: 25 },
      { header: 'Course Code', key: 'code', width: 15 },
      { header: 'Class', key: 'class', width: 15 },
      { header: 'Lecturer', key: 'lecturer', width: 20 },
      { header: 'Venue', key: 'venue', width: 15 },
      { header: 'Time', key: 'time', width: 12 },
      { header: 'Topic', key: 'topic', width: 30 },
      { header: 'Present', key: 'present', width: 10 },
      { header: 'Registered', key: 'total', width: 12 },
      { header: 'PRL Feedback', key: 'feedback', width: 40 }
    ];

    reports.forEach(report => {
      worksheet.addRow({
        date: new Date(report.date_of_lecture).toLocaleDateString(),
        week: report.week_of_reporting,
        course: report.course_name,
        code: report.course_code,
        class: report.class_name,
        lecturer: report.lecturer,
        venue: report.venue,
        time: report.scheduled_time,
        topic: report.topic_taught,
        present: report.actual_students_present,
        total: report.total_registered_students,
        feedback: report.prl_feedback || '—'
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="LUCT_Lecture_Reports.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { exportReports };