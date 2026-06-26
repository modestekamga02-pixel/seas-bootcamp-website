// ==========================================
// SEAS BOOTCAMP OPERATIONS MANAGEMENT CORE ENGINE
// ==========================================

// 1. Initialize State Repositories if missing
if (!localStorage.getItem('is_student_list_published')) {
    localStorage.setItem('is_student_list_published', 'false');
    localStorage.setItem('bootcamp_groups', JSON.stringify([]));
    localStorage.setItem('bootcamp_phase', 'Registration & Ingress Phase');
    localStorage.setItem('final_results', JSON.stringify({}));
}

// 2. Global Administrative Operations Object
const SEAS_Admin = {
    // Feature 1: Toggle public listing visibility
    toggleStudentPublish: function(status) {
        localStorage.setItem('is_student_list_published', status.toString());
        this.showStatusNotification(`Registration list successfully ${status ? 'PUBLISHED' : 'UNPUBLISHED'}.`, '#22c55e');
    },

    // Feature 2: Compile & publish custom project teams
    createAndPublishGroups: function(groupsArray) {
        localStorage.setItem('bootcamp_groups', JSON.stringify(groupsArray));
        this.showStatusNotification("New project group schema compiled and published to landing modules!", '#a855f7');
    },

    // Feature 3: Transition live execution phases
    updateBootcampPhase: function(phaseName) {
        localStorage.setItem('bootcamp_phase', phaseName);
        this.showStatusNotification(`Bootcamp timeline advanced to: ${phaseName}`, '#3b82f6');
    },

    // Feature 4: Broadcast final grades
    publishFinalResults: function(resultsObject) {
        localStorage.setItem('final_results', JSON.stringify(resultsObject));
        this.showStatusNotification("Official performance evaluations and final grades broadcasted!", '#eab308');
    },

    // Helper: Render status alerts on the admin header panel
    showStatusNotification: function(message, color) {
        const msgBox = document.getElementById('statusMessage');
        if (msgBox) {
            msgBox.style.display = 'block';
            msgBox.style.background = color;
            msgBox.style.color = color === '#eab308' ? 'black' : 'white';
            msgBox.style.fontWeight = 'bold';
            msgBox.innerText = `[SYSTEM UPDATE]: ${message}`;
            
            // Auto hide after 4 seconds
            setTimeout(() => { msgBox.style.display = 'none'; }, 4000);
        } else {
            alert(message);
        }
    }
};

// 3. UI Route Router Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Detect if we are looking at the Admin Dashboard Viewport
    if (document.getElementById('admin-dashboard-container')) {
        initializeDashboardListeners();
    }
    
    // Detect if we are looking at the Public Landing Interface Viewport
    if (document.getElementById('public-homepage-container')) {
        renderPublicClientData();
    }
});

// ==========================================
// ADMIN WORKSPACE HOOKS
// ==========================================
function initializeDashboardListeners() {
    console.log("[SEAS ENGINE]: Binding core dashboard components...");

    // Hook Form & Publish Group Form Button
    const submitGroupBtn = document.getElementById('submit-group-btn');
    if (submitGroupBtn) {
        submitGroupBtn.addEventListener('click', () => {
            const groupNameInput = document.getElementById('group-name-input');
            const membersInput = document.getElementById('group-members-input');
            
            const name = groupNameInput.value.trim();
            const membersStr = membersInput.value.trim();
            
            if (!name || !membersStr) {
                alert("Operation Aborted: Group labels and participant strings cannot be null.");
                return;
            }

            const activeGroups = JSON.parse(localStorage.getItem('bootcamp_groups')) || [];
            activeGroups.push({
                name: name,
                members: membersStr.split(',').map(m => m.trim()).filter(m => m.length > 0)
            });

            SEAS_Admin.createAndPublishGroups(activeGroups);
            
            // Clear input fields for next set
            groupNameInput.value = '';
            membersInput.value = '';
        });
    }

    // Hook Phase Update Button
    const updatePhaseBtn = document.getElementById('update-phase-btn');
    if (updatePhaseBtn) {
        updatePhaseBtn.addEventListener('click', () => {
            const selectedPhase = document.getElementById('phase-selector').value;
            SEAS_Admin.updateBootcampPhase(selectedPhase);
        });
    }

    // Hook Final Results Broadcast Button
    const broadcastResultsBtn = document.getElementById('broadcast-results-btn');
    if (broadcastResultsBtn) {
        broadcastResultsBtn.addEventListener('click', () => {
            // Evaluated structure to mock public clearance values matching requirements
            const compositeResults = {
                "Amadou Bello": "Cleared - Grade: Excellent (A) | Certified",
                "Lucrèce": "Cleared - Intern Track Milestone Reached",
                "Kamga Christian": "Cleared - Grade: Very Good (B+) | Certified"
            };
            SEAS_Admin.publishFinalResults(compositeResults);
        });
    }
}

// ==========================================
// PUBLIC VIEW RENDER COMPONENT
// ==========================================
function renderPublicClientData() {
    console.log("[SEAS ENGINE]: Rendering real-time dynamic infrastructure values...");
    
    // 1. Pull current environment variables out of browser storage
    const listPublished  = localStorage.getItem('is_student_list_published') === 'true';
    const currentPhase   = localStorage.getItem('bootcamp_phase') || 'Registration & Ingress Phase';
    const dynamicGroups  = JSON.parse(localStorage.getItem('bootcamp_groups')) || [];
    const absoluteGrades = JSON.parse(localStorage.getItem('final_results')) || {};

    // 2. Fetch DOM Viewports from index.html
    const phaseNode    = document.getElementById('view-current-phase');
    const studentsNode = document.getElementById('view-published-students');
    const groupsNode   = document.getElementById('view-published-groups');
    const resultsNode  = document.getElementById('view-published-results');

    // Inject Timeline State Tracker
    if (phaseNode) phaseNode.innerText = currentPhase;

    // Inject Registered Personnel List block
    if (studentsNode) {
        if (listPublished) {
            const records = JSON.parse(localStorage.getItem('bootcamp_registrations')) || [];
            if (records.length === 0) {
                studentsNode.innerHTML = "<p style='color: #b4c6d0;'>No registrations recorded inside system storage blocks yet.</p>";
            } else {
                studentsNode.innerHTML = `<ul style="list-style-type: square; padding-left: 20px;">
                    ${records.map(r => `<li><strong>${r.name}</strong> — Speciality: ${r.program} [${r.type}]</li>`).join('')}
                </ul>`;
            }
        } else {
            studentsNode.innerHTML = "<p style='color: #e74c3c; font-style: italic;'>The verified listing of authenticated registration panels is currently hidden by administrative lockout.</p>";
        }
    }

    // Inject Assembled Teams Grid
    if (groupsNode) {
        if (dynamicGroups.length === 0) {
            groupsNode.innerHTML = "<p style='color: #b4c6d0;'>Project assignment maps are not yet distributed.</p>";
        } else {
            groupsNode.innerHTML = dynamicGroups.map(g => `
                <div style="background: #2c3e50; color: white; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #a855f7;">
                    <h4 style="margin: 0 0 5px 0; color: #00d2ff;">${g.name}</h4>
                    <p style="margin: 0; font-size: 0.9rem;">Team Roster: ${g.members.join(', ')}</p>
                </div>
            `).join('');
        }
    }

    // Inject Evaluation Standings Panel
    if (resultsNode) {
        if (Object.keys(absoluteGrades).length === 0) {
            resultsNode.innerHTML = "<p style='color: #b4c6d0;'>Official grading arrays are pending core validation metrics.</p>";
        } else {
            resultsNode.innerHTML = Object.entries(absoluteGrades).map(([candidate, verdict]) => `
                <div style="background: #1a252f; border: 1px solid #34495e; padding: 12px; margin-bottom: 8px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold; color: white;">${candidate}</span>
                    <span style="background: #eab308; color: black; padding: 4px 8px; border-radius: 3px; font-size: 0.85rem; font-weight: bold;">${verdict}</span>
                </div>
            `).join('');
        }
    }
}