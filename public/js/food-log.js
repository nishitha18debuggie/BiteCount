// Food Log JavaScript

// Nutrition Preview
const foodSelect = document.getElementById('foodId');
const portionInput = document.getElementById('portion');
const previewDiv = document.getElementById('nutritionPreview');

if (foodSelect && portionInput) {
    function updateNutritionPreview() {
        const selectedOption = foodSelect.options[foodSelect.selectedIndex];
        const portion = parseFloat(portionInput.value) || 1;

        if (selectedOption.value) {
            const calories = parseFloat(selectedOption.dataset.calories) || 0;
            const protein = parseFloat(selectedOption.dataset.protein) || 0;
            const carbs = parseFloat(selectedOption.dataset.carbs) || 0;
            const fats = parseFloat(selectedOption.dataset.fats) || 0;

            document.getElementById('previewCalories').textContent = Math.round(calories * portion);
            document.getElementById('previewProtein').textContent = Math.round(protein * portion);
            document.getElementById('previewCarbs').textContent = Math.round(carbs * portion);
            document.getElementById('previewFats').textContent = Math.round(fats * portion);

            previewDiv.style.display = 'block';
        } else {
            previewDiv.style.display = 'none';
        }
    }

    foodSelect.addEventListener('change', updateNutritionPreview);
    portionInput.addEventListener('input', updateNutritionPreview);
}

// Custom Food Modal
const addCustomBtn = document.getElementById('addCustomFoodBtn');
const customModal = document.getElementById('customFoodModal');
const closeCustomBtn = document.getElementById('closeCustomModal');
const customForm = document.getElementById('customFoodForm');

if (addCustomBtn && customModal) {
    addCustomBtn.addEventListener('click', () => {
        customModal.style.display = 'flex';
    });

    if (closeCustomBtn) {
        closeCustomBtn.addEventListener('click', () => {
            customModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === customModal) {
            customModal.style.display = 'none';
        }
    });
}

if (customForm) {
    customForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(customForm);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/user/food-log/custom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                // Add new food to dropdown
                const option = document.createElement('option');
                option.value = result.food._id;
                option.textContent = `${result.food.name} (${result.food.calories} kcal per 100g)`;
                option.dataset.calories = result.food.calories;
                option.dataset.protein = result.food.protein;
                option.dataset.carbs = result.food.carbs;
                option.dataset.fats = result.food.fats;
                foodSelect.appendChild(option);

                // Select the new food
                foodSelect.value = result.food._id;

                // Close modal and reset form
                customModal.style.display = 'none';
                customForm.reset();

                alert('Custom food added successfully!');
            } else {
                alert('Error adding custom food: ' + (result.errors ? result.errors.map(e => e.msg).join(', ') : 'Unknown error'));
            }
        } catch (error) {
            alert('Error adding custom food');
            console.error(error);
        }
    });
}
