import Nullstack from 'nullstack'

class AdminTopbar extends Nullstack {

  renderLink({ href, children, router }) {
    let selectedClass = ''
    if (router.path === href) {
      selectedClass = 'border-yellow-400 border-b-2'
    }
    return (
      <li class='px-4'>
        <a href={`/admin${href}`} class={`${selectedClass} pb-2`}>{children}</a>
      </li>
    )
  }

  render() {
    return (
      <nav class="w-full flex justify-between pb-8">

        <div class="flex flex-col">
          <span class='text-xs font-bold text-center'> NFTS FOR </span>
          <span class='text-md'>STARVING</span>
          <span class='text-md'>CHILDREN</span>
        </div>

        <ul class="flex items-center">
          <Link href="/pictures/create">mint</Link>
          <Link href="/pictures/list">My Selling NFT's</Link>
          <Link href="/taps">TAPs</Link>
        </ul>

      </nav>
    )
  }
}

export default AdminTopbar
