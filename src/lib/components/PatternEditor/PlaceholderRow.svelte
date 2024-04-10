<div class="flex relative opacity-5">
	<span class="px-2 text-blue-300">--</span>
	<div class="px-2 flex gap-[0.5px] border-l border-slate-600">
		{#each Array(4).fill('.') as dot}
			<span class="text-cyan-400">{dot} </span>
		{/each}
	</div>

	<div class="px-2 flex gap-[0.5px] border-l border-slate-600">
		<span class="text-cyan-400">..</span>
	</div>

	{#each Array(3).fill(null) as _}
		<div class="px-2 flex border-l border-slate-600">
			<div class="px-1 flex gap-[0.5px]">
				<span class="text-blue-100"> --- </span>
			</div>
			<div class="px-1 flex gap-[0.5px]">
				{#each Array(4).fill('.') as prop}
					<span class="text-blue-300">
						{prop}
					</span>
				{/each}
			</div>
			<div class="px-1 flex gap-[0.5px]">
				{#each Array(4).fill('.') as prop}
					<span class="text-yellow-200">
						{prop}
					</span>
				{/each}
			</div>
		</div>
	{/each}
</div>
