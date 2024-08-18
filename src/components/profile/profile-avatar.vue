<template>
	<div class="profile__avatar">
		<div class="profile__avatar-main">
			<ui-avatar :src="avatar" />
			<div class="profile__avatar-file">
				<div class="profile__avatar-upload">
					<ui-button size="small" type="default">Загрузить</ui-button>
					<span>Файл не выбран</span>
				</div>
				<p class="profile__avatar-warn">Максимальный размер файла 1МБ</p>
			</div>
		</div>
		<ui-button class="profile__avatar-delete" size="small" type="danger">
			Удалить изображение
		</ui-button>
	</div>
</template>

<script setup lang="ts">
const avatar: string =
	"https://ae04.alicdn.com/kf/Hd0ee7cfdb28b41df9e0b749f2e74dd6eH/Tony-Stark.jpg"
</script>
