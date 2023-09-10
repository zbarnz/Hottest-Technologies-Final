<script>
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>


	<section>
		<h1>Hottest technologies</h1>
		<h2>This site is under construction</h2>
		<article class="container">
			<menu>
				<input placeholder="Search Tech">
				<ul class="typeSubmenu">
					<li><button>Language</button></li>
					<li><button>Framework</button></li>
					<li><button>Library</button></li>
					<li><button>Stack</button></li>
					<li><button>Cloud</button></li>
					<li><button>Other</button></li>
				</ul>
			</menu>
		</article>
	</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.container {
		width: 90%;
		background-color: var(--color-bg-2);
		/* border: 1px solid var(--color-theme-2); */
		box-shadow: 1px 1px 5px 1px rgb(179, 179, 179);
		border-radius: 5px;
		height: 100vh;
	}

	menu {
		display: flex;
	}

	.typeSubmenu {
		display: flex;
		list-style: none;
	}

	.typeSubmenu button {
		border: none;
		background-color: var(--color-bg-2);
		font-size: x-large;
		cursor: pointer;
	}

	h1 {
		width: 90%;
		margin-bottom: 0;
	}

	h2 {
		margin-bottom: 1em;
	}

</style>
