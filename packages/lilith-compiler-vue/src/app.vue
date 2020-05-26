<script>
import components from './components'

export default {
  name: 'app',
  components: components,
  render() {
    return (
      <div>
        <hello></hello>
      </div>
    )
  }
}
</script>

<style lang="scss">
.red {
  color: red;
}
</style>
