import Nullstack from 'nullstack'

class Topbar extends Nullstack {

  renderLink({ href, children, router }) {
    let selectedClass = ''
    if (router.path === href) {
      selectedClass = 'border-yellow-400 border-b-2'
    }
    return (
      <li class='px-4'>
        <a href={href} class={`${selectedClass}`}>{children}</a>
      </li>
    )
  }

  render() {
    return (
      <nav class="w-full flex justify-between">

        <div class="flex flex-col">
          <span class='text-xs font-bold text-center'> NFTS FOR </span>
          <span class='text-md'>STARVING</span>
          <span class='text-md'>CHILDREN</span>
        </div>

        <ul class="flex items-center">
          <Link href="/">Home</Link>
          <Link href="/wft">WFT?</Link>
          <Link href="/explore">Explore</Link>
          <Link href="/taps">TAPs</Link>
        </ul>

      </nav>
    )
  }
}

export default Topbar
