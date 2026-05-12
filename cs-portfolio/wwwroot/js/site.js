// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

async function handleTranslation() {
	const hangulText = document.getElementById('hangulText');
	const translatedText= document.getElementById('translatedText');

	if (!translatedText) return

	translatedText.value = 'Translating...';

	try {
		const response = await fetch('/hangul', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text: hangulText.value })
		});
		if (response.ok) {
			const data = await response.json();
			translatedText.value = data.text;
			console.log("Translated Text:", data.text);
		} else {
			translatedText.value = 'Translation failed.';
		}
	} catch (error) {
		console.error('Fetch Error:', error);
        translatedText.value = 'An error occurred during translation.';
	}
}
