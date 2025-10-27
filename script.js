// Student data management
class StudentManager {
    constructor() {
        this.students = this.loadStudents();
        this.init();
    }

    // Load students from localStorage or use sample data
    loadStudents() {
        return JSON.parse(localStorage.getItem('students')) || [
            { id: 1, name: "Rahul Sharma", class: "10th", subject: "Math", phone: "9876543210", address: "Mumbai" },
            { id: 2, name: "Priya Patel", class: "9th", subject: "Science", phone: "9876543211", address: "Delhi" },
            { id: 3, name: "Amit Kumar", class: "11th", subject: "Physics", phone: "9876543212", address: "Bangalore" }
        ];
    }

    // Save students to localStorage
    saveStudents() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }

    // Display students in table
    displayStudents() {
        const studentList = document.getElementById('studentList');
        studentList.innerHTML = '';
        
        this.students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>${student.subject}</td>
                <td>${student.phone}</td>
                <td>${student.address}</td>
                <td class="actions">
                    <button class="delete" data-id="${student.id}">Delete</button>
                </td>
            `;
            studentList.appendChild(row);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                this.deleteStudent(id);
            });
        });
    }

    // Add new student
    addStudent(studentData) {
        const newStudent = {
            id: this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) + 1 : 1,
            ...studentData
        };
        
        this.students.push(newStudent);
        this.saveStudents();
        this.displayStudents();
        
        return newStudent;
    }

    // Delete student
    deleteStudent(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            this.students = this.students.filter(student => student.id !== id);
            this.saveStudents();
            this.displayStudents();
            
            this.showSuccessMessage('Student deleted successfully!');
        }
    }

    // Show success message
    showSuccessMessage(message) {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }

    // Initialize the application
    init() {
        this.displayStudents();
    }
}

// Form validation and UI management
class App {
    constructor() {
        this.studentManager = new StudentManager();
        this.initEventListeners();
    }

    // Initialize all event listeners
    initEventListeners() {
        // Menu toggle
        document.getElementById('menuButton').addEventListener('click', () => this.toggleMenu());
        
        // Navigation links
        document.getElementById('viewStudentsLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showTab('students');
        });
        
        document.getElementById('addStudentLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showTab('addStudent');
        });
        
        document.getElementById('addStudentBtn').addEventListener('click', () => {
            this.showTab('addStudent');
        });
        
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.showTab('students');
        });

        // Form submission
        document.getElementById('studentForm').addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Address character counter
        document.getElementById('address').addEventListener('input', () => this.updateCharCounter());

        // Phone number validation
        document.getElementById('phone').addEventListener('input', () => this.validatePhoneInput());

        // Close menu when clicking outside
        window.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    // Toggle menu visibility
    toggleMenu() {
        document.getElementById('dropdownMenu').classList.toggle('show');
    }

    // Show specific tab
    showTab(tabName) {
        document.querySelectorAll('.card').forEach(card => card.classList.add('hidden'));
        document.getElementById(tabName).classList.remove('hidden');
        
        // Close menu when navigating
        document.getElementById('dropdownMenu').classList.remove('show');
        
        // Refresh student list if showing students tab
        if (tabName === 'students') {
            this.studentManager.displayStudents();
        }
    }

    // Handle form submission
    handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            const formData = this.getFormData();
            this.studentManager.addStudent(formData);
            this.resetForm();
            this.showTab('students');
            this.studentManager.showSuccessMessage('Student added successfully!');
        }
    }

    // Validate form inputs
    validateForm() {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const subjectCheckboxes = document.querySelectorAll('input[name="subject"]:checked');
        
        let isValid = true;
        
        // Name validation (only alphabets and spaces)
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(name)) {
            document.getElementById('nameError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('nameError').style.display = 'none';
        }
        
        // Phone validation (exactly 10 digits, numbers only)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            document.getElementById('phoneError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('phoneError').style.display = 'none';
        }
        
        // Subject validation (at least one selected)
        if (subjectCheckboxes.length === 0) {
            document.getElementById('subjectError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('subjectError').style.display = 'none';
        }
        
        // Address validation (max 55 characters)
        if (address.length > 55) {
            document.getElementById('addressError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('addressError').style.display = 'none';
        }
        
        return isValid;
    }

    // Get form data
    getFormData() {
        const subjectCheckboxes = document.querySelectorAll('input[name="subject"]:checked');
        const selectedSubjects = Array.from(subjectCheckboxes).map(cb => cb.value).join(', ');
        
        return {
            name: document.getElementById('name').value,
            class: document.getElementById('class').value,
            subject: selectedSubjects,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };
    }

    // Reset form
    resetForm() {
        document.getElementById('studentForm').reset();
        document.getElementById('charCount').textContent = '0';
        
        // Clear error messages
        document.querySelectorAll('.error').forEach(error => {
            error.style.display = 'none';
        });
    }

    // Update character counter for address field
    updateCharCounter() {
        const addressField = document.getElementById('address');
        const count = addressField.value.length;
        document.getElementById('charCount').textContent = count;
        
        if (count > 55) {
            document.getElementById('addressError').style.display = 'block';
        } else {
            document.getElementById('addressError').style.display = 'none';
        }
    }

    // Validate phone input (numbers only)
    validatePhoneInput() {
        const phoneField = document.getElementById('phone');
        phoneField.value = phoneField.value.replace(/\D/g, '');
    }

    // Handle clicks outside menu to close it
    handleOutsideClick(e) {
        if (!e.target.matches('.menu-button')) {
            const dropdown = document.getElementById('dropdownMenu');
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});