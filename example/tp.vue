<template>
  <div class="container">
    <div>
    <label for="">自动保存</label>
    <input type="text" v-model="form.text">
    </div>
    <div>
    <label for="">只存内层</label>
    <input type="text" v-model="form.memtext">
    </div>
    <div>
      <label for="">
        radio
        <input type="radio" v-model="form.radio" name="vvv" value="1">
        <input type="radio" v-model="form.radio" name="vvv" value="12">
      </label>
    </div>
    select 
    <select name="" id="" v-model="form.select">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <div>
      count {{ count }}
      <button @click="counter">counter</button>
    </div>
    <button @click="reset">reset</button>
    <button @click="reload">reload</button>
  </div>
</template>

<style>
.container {
  width:320px;
  margin: 50px auto;
}
</style>

<script>
export default {
  data() {
    return {
      form: {
        text: '',
        memtext: '',
        radio: false,
        select: ''
      },
      count: 0
    };
  },
  cacheKeys: [
    'form.text',
    {
      key: 'form.memtext',
      useLocalStore: false
    },
    'form.radio',
    'form.select',
    'count'
  ],
  methods: {
    counter () {
      this.count += 1
    },
    reset () {
      localStorage.clear()
      this.reload()
    },
    reload () {
      location.reload()
    }
  }
};
</script>

