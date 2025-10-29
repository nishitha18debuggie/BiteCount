// Admin Foods Management JavaScript

const editModal = document.getElementById('editFoodModal');

// Open Edit Modal
function editFood(id, name, calories, protein, carbs, fats, servingSize, category) {
    document.getElementById('editFoodId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editCalories').value = calories;
    document.getElementById('editProtein').value = protein;
    document.getElementById('editCarbs').value = carbs;
    document.getElementById('editFats').value = fats;
    document.getElementById('editServingSize').value = servingSize;
    document.getElementById('editCategory').value = category;

    editModal.style.display = 'flex';
}

// Close Edit Modal
function closeEditModal() {
    editModal.style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeEditModal();
    }
});

// Handle Edit Form Submission
const editForm = document.getElementById('editFoodForm');
if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const foodId = document.getElementById('editFoodId').value;
        const formData = new FormData(editForm);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(`/admin/foods/update/${foodId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                alert('Food updated successfully!');
                location.reload();
            } else {
                alert('Error updating food: ' + (result.errors ? result.errors.map(e => e.msg).join(', ') : 'Unknown error'));
            }
        } catch (error) {
            alert('Error updating food');
            console.error(error);
        }
    });
}
