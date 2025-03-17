document.querySelectorAll('.folder').forEach(folder => {
	folder.addEventListener('click', function (e) {
		// Убираем обводку с других папок
		document.querySelectorAll('.folder').forEach(f => f.classList.remove('selected'));

		// Добавляем обводку только к выбранной папке
		folder.classList.add('selected');

		e.stopPropagation(); // Чтобы событие не распространилось на другие элементы
	});
});

// Обработчик для скрытия обводки при клике мимо папки
document.addEventListener('click', function (e) {
	if (!e.target.classList.contains('folder')) {
		document.querySelectorAll('.folder').forEach(f => f.classList.remove('selected'));
	}
});

// Обработчик для перемещения окна на передний план
document.querySelectorAll('.window').forEach(window => {
	window.addEventListener('click', function () {
		document.querySelectorAll('.window').forEach(w => w.style.zIndex = 1);
		window.style.zIndex = 1000;  // Перемещаем на передний план
	});
});

// Перетаскивание окон
function makeDraggable(window) {
	const titleBar = window.querySelector('.title-bar');

	let isDragging = false;
	let offsetX = 0;
	let offsetY = 0;

	titleBar.addEventListener('mousedown', (e) => {
		isDragging = true;
		offsetX = e.clientX - window.offsetLeft;
		offsetY = e.clientY - window.offsetTop;
		document.querySelectorAll('.window').forEach(w => w.style.zIndex = 1);
		window.style.zIndex = 1000;
	});

	document.addEventListener('mousemove', (e) => {
		if (isDragging) {
			window.style.left = `${e.clientX - offsetX}px`;
			window.style.top = `${e.clientY - offsetY}px`;
		}
	});

	document.addEventListener('mouseup', () => {
		isDragging = false;
	});
}

document.querySelectorAll('.window').forEach(makeDraggable);

// Закрытие окон
document.querySelectorAll('.close-btn').forEach(btn => {
	btn.addEventListener('click', () => {
		const window = btn.closest('.window');
		const taskbarButton = document.querySelector(`[data-window="${window.id}"]`);
		window.classList.add('hidden');
		if (taskbarButton) taskbarButton.remove();
	});
});

// Создание кнопок на панели задач
function createTaskbarButton(window) {
	const taskbarButtons = document.getElementById('taskbar-buttons');
	const button = document.createElement('div');
	button.classList.add('taskbar-button');
	button.dataset.window = window.id;

	// Берем только текст заголовка без крестика
	const title = window.querySelector('.title-bar').childNodes[0].textContent.trim();
	button.innerHTML = title;

	// Создаем кнопку закрытия на панели задач (с крестиком)
	const closeButton = document.createElement('div');
	closeButton.classList.add('close-btn');
	closeButton.innerHTML = 'x';  // Добавляем крестик в кнопку закрытия
	closeButton.addEventListener('click', (e) => {
		e.stopPropagation();
		window.classList.add('hidden');
		button.remove();
	});

	button.appendChild(closeButton); // Кнопка закрытия добавляется в панель задач

	button.addEventListener('click', () => {
		document.querySelectorAll('.window').forEach(w => w.style.zIndex = 1);
		window.style.zIndex = 1000;
		window.classList.remove('hidden');
	});

	taskbarButtons.appendChild(button);
}

// Инициализация кнопок панели задач
document.querySelectorAll('.window').forEach(window => {
	createTaskbarButton(window);
});

// Восстановление скрытых окон через кнопку "Start"
document.querySelector('.start-btn').addEventListener('click', () => {
	document.querySelectorAll('.window.hidden').forEach(window => {
		window.classList.remove('hidden');
		if (!document.querySelector(`[data-window="${window.id}"]`)) {
			createTaskbarButton(window);
		}
	});
});

// Часы
function updateClock() {
	const clock = document.getElementById('clock');
	const now = new Date();
	clock.textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();
