const healthHistory = JSON.parse(localStorage.getItem('healthHistory')) || [];

document.getElementById('health-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const userId = document.getElementById('user_id').value;
    const bloodPressure = document.getElementById('blood_pressure').value;
    const bloodSugar = parseInt(document.getElementById('blood_sugar').value);
    const heartRate = parseInt(document.getElementById('heart_rate').value);

    const healthData = {
        userId,
        bloodPressure,
        bloodSugar,
        heartRate,
        dateTime: new Date().toLocaleString()
    };

    localStorage.setItem(userId, JSON.stringify(healthData));
    healthHistory.push(healthData);
    localStorage.setItem('healthHistory', JSON.stringify(healthHistory));

    alert('Data submitted successfully!');
    fetchHealthData(userId);
    assessRisk(bloodPressure, bloodSugar, heartRate);
    suggestDiet(bloodSugar);
    suggestActivities(heartRate);
    showDoctorProfiles();
    suggestHospitals(bloodPressure, bloodSugar); // Suggest hospitals
    renderChart(); // Render the chart
});

// Function to fetch health data for a specific user
function fetchHealthData(userId) {
    const data = localStorage.getItem(userId);
    if (data) {
        document.getElementById('data').innerText = data;
    } else {
        document.getElementById('data').innerText = 'No data yet.';
    }
}

// Function to assess risk factors based on input data
function assessRisk(bloodPressure, bloodSugar, heartRate) {
    let riskFactor = "";
    let precautions = "";

    const [systolic, diastolic] = bloodPressure.split('/').map(Number);
    if (systolic > 140 || diastolic > 90) {
        riskFactor += "High Blood Pressure (Hypertension).\n";
        precautions += "Consider reducing salt intake and consult a doctor.\n";
    }

    if (bloodSugar > 140) {
        riskFactor += "High Blood Sugar (Hyperglycemia).\n";
        precautions += "Maintain a balanced diet and consult a healthcare provider.\n";
    }

    if (heartRate < 60 || heartRate > 100) {
        riskFactor += "Abnormal Heart Rate.\n";
        precautions += "Engage in regular exercise and check with a physician.\n";
    }

    const riskOutput = document.getElementById('risk-factor');
    if (riskFactor) {
        riskOutput.innerHTML = `<strong>Risk Factors:</strong><br>${riskFactor}<br><strong>Precautions:</strong><br>${precautions}`;
    } else {
        riskOutput.innerHTML = "Your health metrics are within normal ranges. Keep it up!";
    }
}

// Function to suggest a diet based on blood sugar
function suggestDiet(bloodSugar) {
    const dietDiv = document.getElementById('diet');
    if (bloodSugar > 140) {
        dietDiv.innerHTML = "Focus on low-glycemic foods: leafy greens, whole grains, and legumes. Avoid sugary snacks and drinks.";
    } else {
        dietDiv.innerHTML = "Maintain a balanced diet with plenty of fruits, vegetables, and whole grains.";
    }
}

// Function to suggest physical activities based on heart rate
function suggestActivities(heartRate) {
    const activitiesDiv = document.getElementById('activities');
    if (heartRate < 60) {
        activitiesDiv.innerHTML = "Engage in moderate aerobic activities like brisk walking or cycling for at least 150 minutes a week.";
    } else {
        activitiesDiv.innerHTML = "Incorporate strength training exercises at least twice a week along with aerobic activities.";
    }
}

// Function to show doctor profiles
function showDoctorProfiles() {
    const doctorsDiv = document.getElementById('doctors');
    const doctors = [
        { name: "Dr. John Smith", specialty: "Cardiologist", experience: "10 years", contact: "john.smith@example.com" },
        { name: "Dr. Jane Doe", specialty: "Endocrinologist", experience: "8 years", contact: "jane.doe@example.com" },
        { name: "Dr. Emily Johnson", specialty: "Nutritionist", experience: "5 years", contact: "emily.johnson@example.com" },
    ];

    doctorsDiv.innerHTML = doctors.map(doctor => `
        <div class="doctor-profile">
            <strong>${doctor.name}</strong> - ${doctor.specialty} (${doctor.experience})
            <br>Contact: ${doctor.contact}
        </div>
    `).join('');
}

// Function to suggest nearby hospitals based on health data
function suggestHospitals(bloodPressure, bloodSugar) {
    const hospitalsDiv = document.getElementById('hospitals');
    let suggestedHospitals = [];

    if (bloodSugar > 140 || bloodPressure.includes('/')) {
        suggestedHospitals = [
            { name: "City Hospital", contact: "555-1234", address: "123 Main St" },
            { name: "Health Center", contact: "555-5678", address: "456 Elm St" },
        ];
    } else {
        suggestedHospitals = [
            { name: "General Hospital", contact: "555-8765", address: "789 Oak St" },
            { name: "Community Clinic", contact: "555-4321", address: "321 Pine St" },
        ];
    }

    hospitalsDiv.innerHTML = suggestedHospitals.map(hospital => `
        <div class="hospital-profile">
            <strong>${hospital.name}</strong>
            <br>Contact: ${hospital.contact}
            <br>Address: ${hospital.address}
        </div>
    `).join('');
}

// Function to render the health trends chart
function renderChart() {
    const ctx = document.getElementById('healthChart').getContext('2d');

    // Clear previous data for new chart
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const labels = healthHistory.map(entry => entry.dateTime);
    const bloodSugarData = healthHistory.map(entry => entry.bloodSugar);
    const heartRateData = healthHistory.map(entry => entry.heartRate);

    // Destroy existing chart if it exists
    if (window.healthChart) {
        window.healthChart.destroy();
    }

    // Create a new chart
    window.healthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Blood Sugar (mg/dL)',
                    data: bloodSugarData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                },
                {
                    label: 'Heart Rate (bpm)',
                    data: heartRateData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date/Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Values'
                    }
                }
            }
        }
    });
}

// Optionally, fetch data for a default user on page load
document.addEventListener('DOMContentLoaded', () => {
    const defaultUserId = 'user123'; // Change as needed
    fetchHealthData(defaultUserId);
    renderChart(); // Render the chart on page load
});
