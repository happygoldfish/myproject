from posts.views import posts_list
from posts.models import Post
from users.models import User
import pytest
from django.test import RequestFactory
from django.contrib.auth import get_user_model
from django.utils import timezone
from posts.views import posts_list


User = get_user_model()

@pytest.fixture
def testUser(db):
    return User.objects.create_user(username='testUser123', password='monstermagnet1', email='testemail@mail.com')
@pytest.fixture
def testUser2(db):
    return User.objects.create_user(username='testUser321', password='monstermagnet1', email='testemail@mail.com')


@pytest.fixture
def post_entry(db, testUser):

    return Post.objects.create(
        title='Test Post', 
        body='Test Body', 
        slug='test-slug', 
        date_released=timezone.now(), 
        #date_updated='2026-02-02', 
        banner="default_img.jpg", 
        author=testUser 
    )
 
@pytest.fixture
def post_entry2(db, testUser2):

    return Post.objects.create(
        title='Abra kadabra', 
        body='Simsalabim', 
        slug='Abra-kadabra', 
        date_released=timezone.now(), 
        #date_updated='2026-02-02', 
        banner="default_img.jpg", 
        author=testUser2
    )

def test_posts_list_first_post(client, post_entry):
    ret = client.get('/posts/')
    assert ret.status_code == 200
    assert b'Test Post' in ret.content

def test_posts_list_second_post(client, post_entry2):
    ret = client.get('/posts/')
    assert ret.status_code == 200
    assert b'Abra kadabra' in ret.content


# @pytest.fixture
# def test_post_change(db, testUser):
#### Need to check syntax to edit post!!!
#     return Post.objects.update(
#         title='Changeing the info', 
#         body='Everywhere', 
#         slug='test-slug', 
#         date_released=timezone.now(), 
#         banner="default_img.jpg", 
#         author=testUser 
#     )

# def test_update_post(client, test_post_change):
#     #Call for the change request
#     assert ret.status_code = 302
#
#     ret = client.get('/posts/')
#     assert ret.status_code = 200
#     assert b'Test Post' in ret.content
    


