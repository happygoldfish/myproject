import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
from posts.models import Post

User = get_user_model()

@pytest.fixture
def userDataOne():
    return {
        "username": "testUser123",
        "password": "monstermagnet1",
        "email": "testemail1@mail.com",
    }

@pytest.fixture
def userDataTwo():
    return {
        "username": "testUser321",
        "password": "monstermagnet1",
        "email": "testemail@mail.com",
    }

@pytest.fixture
def postDataOne():
    return {
        "title": "Test Post",
        "body": "Test Body",
        "slug": "test-slug",
        "banner": "default_img.jpg",
    }

@pytest.fixture
def postDataTwo():
    return {
        "title": "Abra kadabra",
        "body": "Sim salabim",
        "slug": "abra-kadabra",
        "banner": "default_img.jpg",
    }

@pytest.fixture
def user_one(db, userDataOne):
    return User.objects.create_user(
        username=userDataOne["username"],
        password=userDataOne["password"],
        email=userDataOne["email"],
    )

@pytest.fixture
def user_two(db, userDataTwo):
    return User.objects.create_user(
        username=userDataTwo["username"],
        password=userDataTwo["password"],
        email=userDataTwo["email"],
    )

def test_create_user_in_db(user_one, userDataOne):
    assert User.objects.count() == 1
    assert user_one.username == userDataOne["username"]
    assert user_one.email == userDataOne["email"]
    assert user_one.check_password(userDataOne["password"])

def test_create_second_user_in_db(user_two, userDataTwo):
    assert User.objects.count() == 1
    assert user_two.username == userDataTwo["username"]
    assert user_two.email == userDataTwo["email"]
    assert user_two.check_password(userDataTwo["password"])

def test_create_post_in_db(db, postDataOne, user_one):
    new_post = Post.objects.create(
        title=postDataOne["title"],
        body=postDataOne["body"],
        slug=postDataOne["slug"],
        date_released=timezone.now(),
        banner=postDataOne["banner"],
        author=user_one,   # <-- real User instance
    )

    assert Post.objects.count() == 1
    assert new_post.title == postDataOne["title"]
    assert new_post.body == postDataOne["body"]
    assert new_post.author == user_one

def test_create_second_post_in_db(db, postDataTwo, user_two):
    new_post = Post.objects.create(
        title=postDataTwo["title"],
        body=postDataTwo["body"],
        slug=postDataTwo["slug"],
        date_released=timezone.now(),
        banner=postDataTwo["banner"],
        author=user_two,   # <-- real User instance
    )

    assert Post.objects.count() == 1
    assert new_post.title == postDataTwo["title"]
    assert new_post.body == postDataTwo["body"]
    assert new_post.author == user_two


@pytest.fixture
def post_entry(db, user_one):
    return Post.objects.create(
        title="Original title",
        body="Original body",
        slug="original-title",
        date_released=timezone.now(),
        banner="default_img.jpg",
        author=user_one,
    )

def test_update_post_with_objects_update(db, post_entry):
    rows = Post.objects.filter(pk=post_entry.pk).update(
        title="Updated title",
        body="Updated body",
    )

    assert rows == 1

    post_entry.refresh_from_db()
    assert post_entry.title == "Updated title"
    assert post_entry.body == "Updated body"


def test_update_post_with_instance_save(db, post_entry):
    post_entry.title = "Saved title"
    post_entry.body = "Saved body"
    post_entry.save()

    updated = Post.objects.get(pk=post_entry.pk)
    assert updated.title == "Saved title"
    assert updated.body == "Saved body"

def test_delete_post(db, post_entry):
    pk = post_entry.pk
    post_entry.delete()

    assert Post.objects.filter(pk=pk).count() == 0