# Installs nodejs and yarn 
# TODO: Add ansible playbook to do this
curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
sudo dnf -y install nodejs
sudo dnf -y groupinstall 'Development Tools'

sudo wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
sudo dnf install -y yarn