<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
    <div v-if="updateAvailable" class="notification">
      <progress :value="updatedownloadprogress.progress" max="100"> ({{updatedownloadprogress.percent}}%) </progress>
      {{updatedownloadprogress.bytesPerSecond}}bytes/second Total Size: {{updatedownloadprogress.transferred}} / {{updatedownloadprogress.total}}
      {{updatedownloadprogress}}
      <p v-html="updaterMessage"></p>
    </div>    
  </div>
</template>
<script>
const { ipcRenderer } = require('electron');
export default {
  data() {
    return {
      updateAvailable:false,
      updatedownloadprogress:{},
      updaterMessage:'',
    }
  },
  mounted() {
    ipcRenderer.on('update_available', () => {
      ipcRenderer.removeAllListeners('update_available');
      this.updateAvailable = true;
      this.updaterMessage = 'A new update is available. Downloading now...';
    });
    ipcRenderer.on('update_error', (error) => {
      ipcRenderer.removeAllListeners('update_error');
      this.updateAvailable = true;
      this.updaterMessage = error;
      setTimeout(() => {
        this.updateAvailable = false;
      }, 5000);
    });
    ipcRenderer.on('update_downloaded', () => {
      ipcRenderer.removeAllListeners('update_available');
      this.updateAvailable = true;
      this.updaterMessage = 'Update Downloaded. It will be installed on restart. Restart now?';
    });
    ipcRenderer.on('update-not-available', () => {
      ipcRenderer.removeAllListeners('update-not-available');
        this.updateAvailable = true;
      this.updaterMessage = 'You have the latest version installed.';
      setTimeout(() => {
        this.updateAvailable = false;
      }, 5000);
    });
    ipcRenderer.on('update-download-progress', (data) => {
      ipcRenderer.removeAllListeners('update-download-progress');
      this.updatedownloadprogress = data;
    });
  },
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.notification {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 200px;
  padding: 20px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.hidden {
  display: none;
}
</style>
