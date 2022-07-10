<script lang="ts" setup>

async function submit() { }

</script>

<template>
    <div class="p-5 bg-base-300">
        <h1 class="mt-12 font-bold text-4xl font-mont">New Post</h1>
    </div>

    <div class="mt-5 p-5 mx-auto sm:w-1/4">
        <form @submit.prevent="submit">
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Select an Image</span>
                </label>
                <input type="file" class="input" accept="image/*" />
            </div>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Title</span>
                </label>
                <input type="text" placeholder="Title" maxlength="100" id="title" name="title"
                    class="input input-bordered" />
            </div>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Description</span>
                </label>
                <textarea type="text" placeholder="Description" maxlength="100" id="title" name="title"
                    class="textarea textarea-bordered resize-none" />
            </div>

            <div class="form-control mt-5">
                <input type="submit" value="Submit" class="btn btn-primary" />
            </div>

        </form>
    </div>

</template>
