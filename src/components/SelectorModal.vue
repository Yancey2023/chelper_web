<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    showNames: {
      type: Array,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    onSelect(index) {
      this.$emit('select', this.data[index])
      this.closeModal()
    },
  },
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <button class="modal-title-free-space">&times;</button>
        <div class="modal-title-container">
          <h3 class="modal-title">{{ title }}</h3>
        </div>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <button
        v-for="(showName, index) in showNames"
        :key="index"
        @click="onSelect(index)"
        class="button"
      >
        {{ showName }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.modal-title {
  margin: 0;
}

.button {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  padding: 5px;
  cursor: pointer;
  color: #333;
}

.modal-title-free-space {
  background: none;
  border: none;
  font-size: 24px;
  padding: 5px;
  color: #00000000;
}

.close-button:hover {
  color: #000;
}
</style>
